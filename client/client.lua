local isOpen = false
local busy = false      -- an inline NUI input is focused, menu keys are paused
local lockUntil = 0     -- ignore keys briefly after the keyboard closes
local initSent = false

local invisible = false
local godmode = false
local developermode = false
local showCoords = false
local vehicleDevMode = false

local PlayerActions = {
    kill = true, revive = true, freeze = true, spectate = true, ['goto'] = true,
    bring = true, intovehicle = true, inventory = true, cloth = true,
}
local VehicleCommands = { fix = 'fix', buy = 'admincar', remove = 'dv', maxmods = 'maxmods' }

--[[
    Helpers
--]]
local function Draw2DText(content, font, colour, scale, x, y)
    SetTextFont(font)
    SetTextScale(scale, scale)
    SetTextColour(colour[1], colour[2], colour[3], 255)
    BeginTextCommandDisplayText('STRING')
    SetTextDropShadow(0, 0, 0, 0, 255)
    SetTextDropShadow()
    SetTextEdge(4, 0, 0, 0, 255)
    SetTextOutline()
    AddTextComponentSubstringPlayerName(content)
    EndTextCommandDisplayText(x, y)
end

local function ToggleShowCoordinates()
    showCoords = not showCoords
    if not showCoords then return end
    CreateThread(function()
        while showCoords do
            local ped = PlayerPedId()
            local coords = GetEntityCoords(ped)
            local c = {
                x = QBCore.Shared.Round(coords.x, 2),
                y = QBCore.Shared.Round(coords.y, 2),
                z = QBCore.Shared.Round(coords.z, 2),
            }
            local heading = QBCore.Shared.Round(GetEntityHeading(ped), 2)
            Draw2DText(string.format('~w~' .. Lang:t('info.ped_coords') .. '~b~ vector4(~w~%s~b~, ~w~%s~b~, ~w~%s~b~, ~w~%s~b~)', c.x, c.y, c.z, heading), 4, { 66, 182, 245 }, 0.4, 0.4, 0.025)
            Wait(0)
        end
    end)
end

local function ToggleVehicleDeveloperMode()
    vehicleDevMode = not vehicleDevMode
    if not vehicleDevMode then return end
    CreateThread(function()
        local x, y = 0.4, 0.888
        while vehicleDevMode do
            local ped = PlayerPedId()
            if IsPedInAnyVehicle(ped, false) then
                local vehicle = GetVehiclePedIsIn(ped, false)
                local netID = VehToNet(vehicle)
                local hash = GetEntityModel(vehicle)
                local modelName = GetLabelText(GetDisplayNameFromVehicleModel(hash))
                local eHealth = GetVehicleEngineHealth(vehicle)
                local bHealth = GetVehicleBodyHealth(vehicle)
                Draw2DText(Lang:t('info.vehicle_dev_data'), 4, { 66, 182, 245 }, 0.4, x, y)
                Draw2DText(string.format(Lang:t('info.ent_id') .. '~b~%s~s~ | ' .. Lang:t('info.net_id') .. '~b~%s~s~', vehicle, netID), 4, { 255, 255, 255 }, 0.4, x, y + 0.025)
                Draw2DText(string.format(Lang:t('info.model') .. '~b~%s~s~ | ' .. Lang:t('info.hash') .. '~b~%s~s~', modelName, hash), 4, { 255, 255, 255 }, 0.4, x, y + 0.050)
                Draw2DText(string.format(Lang:t('info.eng_health') .. '~b~%s~s~ | ' .. Lang:t('info.body_health') .. '~b~%s~s~', QBCore.Shared.Round(eHealth, 2), QBCore.Shared.Round(bHealth, 2)), 4, { 255, 255, 255 }, 0.4, x, y + 0.075)
                Wait(0)
            else
                Wait(500)
            end
        end
    end)
end

local function CopyToClipboard(dataType, silent)
    local ped = PlayerPedId()
    local function ok(msg)
        if not silent then QBCore.Functions.Notify(msg, 'success') end
        return true
    end
    if dataType == 'coords2' then
        local c = GetEntityCoords(ped)
        SendNUIMessage({ string = string.format('vector2(%s, %s)', QBCore.Shared.Round(c.x, 2), QBCore.Shared.Round(c.y, 2)) })
        return ok(Lang:t('success.coords_copied'))
    elseif dataType == 'coords3' then
        local c = GetEntityCoords(ped)
        SendNUIMessage({ string = string.format('vector3(%s, %s, %s)', QBCore.Shared.Round(c.x, 2), QBCore.Shared.Round(c.y, 2), QBCore.Shared.Round(c.z, 2)) })
        return ok(Lang:t('success.coords_copied'))
    elseif dataType == 'coords4' then
        local c = GetEntityCoords(ped)
        SendNUIMessage({ string = string.format('vector4(%s, %s, %s, %s)', QBCore.Shared.Round(c.x, 2), QBCore.Shared.Round(c.y, 2), QBCore.Shared.Round(c.z, 2), QBCore.Shared.Round(GetEntityHeading(ped), 2)) })
        return ok(Lang:t('success.coords_copied'))
    elseif dataType == 'heading' then
        SendNUIMessage({ string = QBCore.Shared.Round(GetEntityHeading(ped), 2) })
        return ok(Lang:t('success.heading_copied'))
    elseif dataType == 'freeaimEntity' then
        local entity = GetFreeAimEntity()
        if entity then
            local hash = GetEntityModel(entity)
            local name = Entities[hash] or 'Unknown'
            local c = GetEntityCoords(entity)
            local r = GetEntityRotation(entity)
            local R = QBCore.Shared.Round
            SendNUIMessage({
                string = string.format('Model Name:\t%s\nModel Hash:\t%s\n\nHeading:\t%s\nCoords:\t\tvector3(%s, %s, %s)\nRotation:\tvector3(%s, %s, %s)', name, hash, R(GetEntityHeading(entity), 2), R(c.x, 2), R(c.y, 2), R(c.z, 2), R(r.x, 2), R(r.y, 2), R(r.z, 2))
            })
            return ok(Lang:t('success.entity_copy'))
        end
        if not silent then QBCore.Functions.Notify(Lang:t('error.failed_entity_copy'), 'error') end
        return false
    end
    return false
end

RegisterNetEvent('qb-admin:client:copyToClipboard', function(dataType)
    CopyToClipboard(dataType)
end)

RegisterNetEvent('qb-admin:client:ToggleCoords', function()
    ToggleShowCoordinates()
end)

--[[
    Toggles: each returns the new state so the panel always shows the truth.
--]]
local function SetInvincible()
    SetPlayerInvincible(PlayerId(), godmode or developermode)
end

local Toggles = {
    noclip = function()
        local want = not IsNoClipActive()
        -- pass the state explicitly: it waits for the camera, so do not hold the callback
        CreateThread(function() ToggleNoClip(want) end)
        return want
    end,
    invisible = function()
        invisible = not invisible
        SetEntityVisible(PlayerPedId(), not invisible, 0)
        return invisible
    end,
    god = function()
        godmode = not godmode
        SetInvincible()
        if godmode then
            CreateThread(function()
                while godmode do
                    SetInvincible() -- survives respawns and ped changes
                    Wait(1000)
                end
            end)
        end
        return godmode
    end,
    names = function()
        local names = GetNamesBlipsState()
        TriggerEvent('qb-admin:client:toggleNames')
        return not names
    end,
    blips = function()
        local _, blips = GetNamesBlipsState()
        TriggerEvent('qb-admin:client:toggleBlips')
        return not blips
    end,
    coords = function()
        ToggleShowCoordinates()
        return showCoords
    end,
    vehdev = function()
        ToggleVehicleDeveloperMode()
        return vehicleDevMode
    end,
    huddev = function()
        developermode = not developermode
        TriggerEvent('qb-admin:client:ToggleDevmode')
        SetInvincible()
        return developermode
    end,
    evfree = function() ToggleEntityFreeView() return GetEntityViewStates().freeaim end,
    evveh  = function() ToggleEntityVehicleView() return GetEntityViewStates().vehicles end,
    evped  = function() ToggleEntityPedView() return GetEntityViewStates().peds end,
    evobj  = function() ToggleEntityObjectView() return GetEntityViewStates().objects end,
}

local function GetState()
    local names, blips = GetNamesBlipsState()
    local ev = GetEntityViewStates()
    return {
        noclip = IsNoClipActive(), invisible = invisible, god = godmode,
        names = names, blips = blips, coords = showCoords, vehdev = vehicleDevMode,
        huddev = developermode, evfree = ev.freeaim, evveh = ev.vehicles,
        evped = ev.peds, evobj = ev.objects,
        evDist = GetEntityViewDistance(), hour = GetClockHours(),
    }
end

--[[
    Static data (weapons, vehicles, config) is sent once, the first time the menu opens.
--]]
local function BuildInit()
    local weapons = {}
    for _, v in pairs(QBCore.Shared.Weapons) do
        if v.name and v.label then weapons[#weapons + 1] = { v.label, v.name } end
    end
    table.sort(weapons, function(a, b) return a[1] < b[1] end)

    local byCat, vehicles = {}, {}
    for model, v in pairs(QBCore.Shared.Vehicles) do
        local cat = QBCore.Shared.FirstToUpper(v.category or 'other')
        byCat[cat] = byCat[cat] or {}
        byCat[cat][#byCat[cat] + 1] = { v.name or model, model }
    end
    for cat, list in pairs(byCat) do
        table.sort(list, function(a, b) return a[1] < b[1] end)
        vehicles[#vehicles + 1] = { c = cat, v = list }
    end
    table.sort(vehicles, function(a, b) return a.c < b.c end)

    local ban = {}
    for i, l in ipairs(Config.BanLengths) do ban[i] = { l.label, tostring(l.seconds) } end

    return {
        action = 'init',
        weapons = weapons,
        vehicles = vehicles,
        config = {
            dock = Config.Dock,
            keys = Config.KeyLabels,
            sections = Config.Sections,
            banLengths = ban,
            groups = Config.Groups,
        },
    }
end

--[[
    Open / close
--]]
local function CloseMenu()
    if not isOpen then return end
    isOpen = false
    busy = false
    SetNuiFocus(false, false)
    SendNUIMessage({ action = 'close' })
end

local function NavLoop()
    local c = Config.Controls
    local blocked = {}
    for _, v in pairs(c) do blocked[#blocked + 1] = v end
    for _, v in ipairs(Config.BlockedControls) do blocked[#blocked + 1] = v end
    local count = #blocked
    local held = {}

    local function pulse(ctrl)
        if IsDisabledControlJustPressed(0, ctrl) then
            held[ctrl] = GetGameTimer() + 350
            return true
        end
        if IsDisabledControlPressed(0, ctrl) then
            if held[ctrl] and GetGameTimer() >= held[ctrl] then
                held[ctrl] = GetGameTimer() + 70
                return true
            end
        else
            held[ctrl] = nil
        end
        return false
    end

    while isOpen do
        for i = 1, count do DisableControlAction(0, blocked[i], true) end
        if not busy and GetGameTimer() >= lockUntil then
            local key
            if pulse(c.up) then key = 'up'
            elseif pulse(c.down) then key = 'down'
            elseif pulse(c.left) then key = 'left'
            elseif pulse(c.right) then key = 'right'
            elseif IsDisabledControlJustPressed(0, c.select) then key = 'select'
            elseif IsDisabledControlJustPressed(0, c.back) then key = 'back'
            end
            if key then SendNUIMessage({ action = 'key', key = key }) end
        end
        Wait(0)
    end
end

local function OpenMenu()
    if isOpen then return CloseMenu() end
    QBCore.Functions.TriggerCallback('qb-admin:isAdmin', function(isAdmin)
        if not isAdmin or isOpen then return end
        isOpen = true
        lockUntil = GetGameTimer() + 250
        if not initSent then
            initSent = true
            SendNUIMessage(BuildInit())
        end
        SendNUIMessage({ action = 'open', state = GetState() })
        CreateThread(NavLoop)
    end)
end

RegisterNetEvent('qb-admin:client:openMenu', OpenMenu)

RegisterCommand('adminmenu', OpenMenu, false)
if Config.OpenKey and Config.OpenKey ~= '' then
    RegisterKeyMapping('adminmenu', 'Open admin menu', 'keyboard', Config.OpenKey)
end

--[[
    NUI callbacks
--]]
RegisterNUICallback('close', function(_, cb)
    CloseMenu()
    cb({})
end)

RegisterNUICallback('inputFocus', function(data, cb)
    busy = data.focus == true
    SetNuiFocus(busy, false)
    if not busy then lockUntil = GetGameTimer() + 300 end
    cb({})
end)

RegisterNUICallback('toggle', function(data, cb)
    local fn = Toggles[data.key]
    cb({ value = fn and fn() or false })
end)

RegisterNUICallback('revive', function(_, cb)
    TriggerEvent('hospital:client:Revive', PlayerPedId())
    cb({})
end)

RegisterNUICallback('weapon', function(data, cb)
    if type(data.name) == 'string' then
        TriggerServerEvent('qb-admin:giveWeapon', data.name)
    end
    cb({})
end)

RegisterNUICallback('getPlayers', function(_, cb)
    QBCore.Functions.TriggerCallback('test:getplayers', function(players)
        cb(players or {})
    end)
end)

RegisterNUICallback('getDealers', function(_, cb)
    QBCore.Functions.TriggerCallback('test:getdealers', function(dealers)
        local out = {}
        for _, v in pairs(dealers or {}) do out[#out + 1] = v.name end
        cb(out)
    end)
end)

RegisterNUICallback('playerAction', function(data, cb)
    if PlayerActions[data.action] and tonumber(data.id) then
        TriggerServerEvent('qb-admin:server:' .. data.action, { id = tonumber(data.id) })
    end
    cb({})
end)

RegisterNUICallback('kick', function(data, cb)
    if tonumber(data.id) and type(data.reason) == 'string' and data.reason ~= '' then
        TriggerServerEvent('qb-admin:server:kick', { id = tonumber(data.id) }, data.reason)
    end
    cb({})
end)

RegisterNUICallback('ban', function(data, cb)
    if tonumber(data.id) and tonumber(data.length) and type(data.reason) == 'string' and data.reason ~= '' then
        TriggerServerEvent('qb-admin:server:ban', { id = tonumber(data.id) }, tonumber(data.length), data.reason)
    end
    cb({})
end)

RegisterNUICallback('setPermissions', function(data, cb)
    for _, g in ipairs(Config.Groups) do
        if g.value == data.group and tonumber(data.id) then
            TriggerServerEvent('qb-admin:server:setPermissions', tonumber(data.id), { { rank = g.value, label = g.label } })
            break
        end
    end
    cb({})
end)

RegisterNUICallback('weather', function(data, cb)
    if type(data.value) == 'string' then
        TriggerServerEvent('qb-weathersync:server:setWeather', data.value)
    end
    cb({})
end)

RegisterNUICallback('time', function(data, cb)
    local hour = tonumber(data.hour)
    if hour and hour >= 0 and hour <= 23 then
        TriggerServerEvent('qb-weathersync:server:setTime', math.floor(hour), 0)
    end
    cb({})
end)

RegisterNUICallback('vehicle', function(data, cb)
    local command = VehicleCommands[data.action]
    if command then TriggerServerEvent('QBCore:CallCommand', command, {}) end
    cb({})
end)

RegisterNUICallback('spawn', function(data, cb)
    if type(data.model) == 'string' then
        TriggerServerEvent('QBCore:CallCommand', 'car', { data.model })
    end
    cb({})
end)

RegisterNUICallback('dealerGoto', function(data, cb)
    TriggerServerEvent('QBCore:CallCommand', 'dealergoto', { data.name })
    cb({})
end)

RegisterNUICallback('dealerRemove', function(data, cb)
    TriggerServerEvent('QBCore:CallCommand', 'deletedealer', { data.name })
    cb({})
end)

local CopyTypes = { vector3 = 'coords3', vector4 = 'coords4', heading = 'heading', freeaim = 'freeaimEntity' }
RegisterNUICallback('copy', function(data, cb)
    local kind = CopyTypes[data.type]
    cb({ ok = kind and CopyToClipboard(kind, true) or false })
end)

RegisterNUICallback('entityDistance', function(data, cb)
    SetEntityViewDistance(data.value)
    cb({})
end)
