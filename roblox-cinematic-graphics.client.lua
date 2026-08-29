-- Put this LocalScript in StarterPlayer > StarterPlayerScripts.
-- It builds a cinematic blue Roblox scene like the reference:
-- sky haze, dark grid floor, strong shadows, post-processing, and a simple red HUD bar.

local Players = game:GetService("Players")
local Lighting = game:GetService("Lighting")
local TweenService = game:GetService("TweenService")
local RunService = game:GetService("RunService")

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

local STYLE_FOLDER_NAME = "CinematicBlueGraphics"
local WORLD_FOLDER_NAME = "LocalCinematicWorld"
local GUI_NAME = "CinematicHud"

local function destroyIfExists(parent, name)
	local existing = parent:FindFirstChild(name)
	if existing then
		existing:Destroy()
	end
end

local function createEffect(className, properties)
	local effect = Instance.new(className)
	effect.Name = properties.Name or className

	for key, value in pairs(properties) do
		if key ~= "Name" then
			effect[key] = value
		end
	end

	effect.Parent = Lighting
	return effect
end

local function setupLighting()
	destroyIfExists(Lighting, STYLE_FOLDER_NAME)

	local folder = Instance.new("Folder")
	folder.Name = STYLE_FOLDER_NAME
	folder.Parent = Lighting

	Lighting.ClockTime = 14.3
	Lighting.Brightness = 2.1
	Lighting.ExposureCompensation = -0.45
	Lighting.GlobalShadows = true
	Lighting.EnvironmentDiffuseScale = 0.25
	Lighting.EnvironmentSpecularScale = 0.65
	Lighting.Ambient = Color3.fromRGB(24, 50, 61)
	Lighting.OutdoorAmbient = Color3.fromRGB(80, 175, 180)
	Lighting.FogColor = Color3.fromRGB(105, 232, 231)
	Lighting.FogStart = 120
	Lighting.FogEnd = 620

	local atmosphere = Instance.new("Atmosphere")
	atmosphere.Name = "CyanHaze"
	atmosphere.Color = Color3.fromRGB(116, 247, 238)
	atmosphere.Decay = Color3.fromRGB(20, 38, 48)
	atmosphere.Density = 0.43
	atmosphere.Offset = 0.18
	atmosphere.Glare = 0.15
	atmosphere.Haze = 2.8
	atmosphere.Parent = folder

	createEffect("ColorCorrectionEffect", {
		Name = "ColdCinemaGrade",
		Brightness = -0.09,
		Contrast = 0.28,
		Saturation = -0.16,
		TintColor = Color3.fromRGB(151, 255, 247),
	}).Parent = folder

	createEffect("BloomEffect", {
		Name = "SoftBloom",
		Intensity = 0.55,
		Size = 36,
		Threshold = 1.35,
	}).Parent = folder

	createEffect("DepthOfFieldEffect", {
		Name = "FarFocus",
		FarIntensity = 0.23,
		FocusDistance = 42,
		InFocusRadius = 30,
		NearIntensity = 0.04,
	}).Parent = folder

	createEffect("SunRaysEffect", {
		Name = "LightWash",
		Intensity = 0.045,
		Spread = 0.72,
	}).Parent = folder
end

local function setupWorld()
	destroyIfExists(workspace, WORLD_FOLDER_NAME)

	local folder = Instance.new("Folder")
	folder.Name = WORLD_FOLDER_NAME
	folder.Parent = workspace

	local base = Instance.new("Part")
	base.Name = "DarkGridFloor"
	base.Anchored = true
	base.CanCollide = true
	base.Material = Enum.Material.SmoothPlastic
	base.Color = Color3.fromRGB(14, 29, 35)
	base.Size = Vector3.new(900, 1, 900)
	base.Position = Vector3.new(0, -0.55, 0)
	base.Parent = folder

	local gridColor = Color3.fromRGB(76, 112, 121)
	local gridStep = 40
	local gridHalf = 440

	for i = -gridHalf, gridHalf, gridStep do
		local lineX = Instance.new("Part")
		lineX.Name = "GridLineX"
		lineX.Anchored = true
		lineX.CanCollide = false
		lineX.Material = Enum.Material.Neon
		lineX.Color = gridColor
		lineX.Transparency = 0.42
		lineX.Size = Vector3.new(1.1, 0.025, gridHalf * 2)
		lineX.Position = Vector3.new(i, 0.015, 0)
		lineX.Parent = folder

		local lineZ = Instance.new("Part")
		lineZ.Name = "GridLineZ"
		lineZ.Anchored = true
		lineZ.CanCollide = false
		lineZ.Material = Enum.Material.Neon
		lineZ.Color = gridColor
		lineZ.Transparency = 0.42
		lineZ.Size = Vector3.new(gridHalf * 2, 0.025, 1.1)
		lineZ.Position = Vector3.new(0, 0.02, i)
		lineZ.Parent = folder
	end

	local horizonGlow = Instance.new("Part")
	horizonGlow.Name = "HorizonGlow"
	horizonGlow.Anchored = true
	horizonGlow.CanCollide = false
	horizonGlow.Material = Enum.Material.Neon
	horizonGlow.Color = Color3.fromRGB(83, 235, 231)
	horizonGlow.Transparency = 0.72
	horizonGlow.Size = Vector3.new(900, 10, 2)
	horizonGlow.Position = Vector3.new(0, 12, -360)
	horizonGlow.Parent = folder
end

local function setupHud()
	destroyIfExists(playerGui, GUI_NAME)

	local gui = Instance.new("ScreenGui")
	gui.Name = GUI_NAME
	gui.IgnoreGuiInset = true
	gui.ResetOnSpawn = false
	gui.Parent = playerGui

	local vignette = Instance.new("Frame")
	vignette.Name = "BlueVignette"
	vignette.BackgroundColor3 = Color3.fromRGB(0, 18, 24)
	vignette.BackgroundTransparency = 0.74
	vignette.BorderSizePixel = 0
	vignette.Size = UDim2.fromScale(1, 1)
	vignette.Parent = gui

	local gradient = Instance.new("UIGradient")
	gradient.Transparency = NumberSequence.new({
		NumberSequenceKeypoint.new(0, 0.25),
		NumberSequenceKeypoint.new(0.44, 1),
		NumberSequenceKeypoint.new(0.56, 1),
		NumberSequenceKeypoint.new(1, 0.15),
	})
	gradient.Rotation = 90
	gradient.Parent = vignette

	local holder = Instance.new("Frame")
	holder.Name = "BottomRedBar"
	holder.AnchorPoint = Vector2.new(0, 1)
	holder.BackgroundTransparency = 1
	holder.Position = UDim2.new(0, 54, 1, -42)
	holder.Size = UDim2.new(0, 170, 0, 16)
	holder.Parent = gui

	local shadow = Instance.new("Frame")
	shadow.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
	shadow.BackgroundTransparency = 0.35
	shadow.BorderSizePixel = 0
	shadow.Position = UDim2.fromOffset(0, 7)
	shadow.Size = UDim2.new(1, 4, 0, 5)
	shadow.Parent = holder

	local bar = Instance.new("Frame")
	bar.Name = "Bar"
	bar.BackgroundColor3 = Color3.fromRGB(151, 21, 32)
	bar.BorderSizePixel = 0
	bar.Position = UDim2.fromOffset(0, 5)
	bar.Size = UDim2.new(1, 0, 0, 6)
	bar.Parent = holder

	local endDot = Instance.new("Frame")
	endDot.Name = "LeftDot"
	endDot.AnchorPoint = Vector2.new(0.5, 0.5)
	endDot.BackgroundColor3 = Color3.fromRGB(151, 21, 32)
	endDot.BorderSizePixel = 0
	endDot.Position = UDim2.fromOffset(0, 8)
	endDot.Size = UDim2.fromOffset(12, 12)
	endDot.Parent = holder

	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(1, 0)
	corner.Parent = endDot
end

local function setupCamera()
	local camera = workspace.CurrentCamera
	if not camera then
		return
	end

	camera.FieldOfView = 58

	local function updateForCharacter(character)
		local root = character:WaitForChild("HumanoidRootPart", 8)
		if not root then
			return
		end

		task.wait(0.2)

		local start = root.CFrame * CFrame.new(0, 8, 26) * CFrame.Angles(math.rad(-10), 0, 0)
		camera.CameraType = Enum.CameraType.Scriptable
		camera.CFrame = start

		local tween = TweenService:Create(
			camera,
			TweenInfo.new(1.2, Enum.EasingStyle.Sine, Enum.EasingDirection.Out),
			{ CFrame = root.CFrame * CFrame.new(0, 6.5, 20) * CFrame.Angles(math.rad(-8), 0, 0) }
		)
		tween:Play()

		task.delay(2.25, function()
			if camera then
				camera.CameraType = Enum.CameraType.Custom
			end
		end)
	end

	if player.Character then
		task.spawn(updateForCharacter, player.Character)
	end

	player.CharacterAdded:Connect(updateForCharacter)
end

setupLighting()
setupWorld()
setupHud()
setupCamera()

RunService.RenderStepped:Connect(function()
	local camera = workspace.CurrentCamera
	if camera then
		camera.FieldOfView = camera.FieldOfView + (58 - camera.FieldOfView) * 0.025
	end
end)
