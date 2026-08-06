import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "../../../../lib/supabase";

// ─── GET Handler: Fast polling endpoint for card generation job status ────────
// Returns { status: "pending" | "processing" | "done" | "failed", imageUrl?, error? }
// Each call is a single Supabase SELECT — completes in <50ms
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    const { jobId } = await params;

    if (!jobId) {
        return NextResponse.json({ status: "not_found" }, { status: 400 });
    }

    const supabase = createServerSupabase();

    const { data: job, error } = await supabase
        .from("card_jobs")
        .select("status, image_url, error, created_at")
        .eq("id", jobId)
        .single();

    if (error || !job) {
        return NextResponse.json({ status: "not_found" }, { status: 404 });
    }

    // Check if job is stale (> 5 minutes old and still pending/processing)
    const ageMs = Date.now() - new Date(job.created_at).getTime();
    if ((job.status === "pending" || job.status === "processing") && ageMs > 5 * 60 * 1000) {
        return NextResponse.json({
            status: "failed",
            error: "Generation timed out. Please try again.",
        });
    }

    return NextResponse.json({
        status: job.status,
        imageUrl: job.image_url || undefined,
        error: job.error || undefined,
    });
}
