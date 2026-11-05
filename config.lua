Config = {}

-- Key that opens and closes the menu. Players can rebind it in
-- Settings > Key Bindings > FiveM.
Config.OpenKey = 'F6'

-- Side of the screen the panel uses the first time an admin opens it
-- ('right' or 'left'). Admins can switch it from the menu
Config.Dock = 'right'

-- Game controls used to move through the menu.
Config.Controls = { up = 172, down = 173, left = 174, right = 175, select = 191, back = 177 }

-- Labels shown in the footer for those controls.
Config.KeyLabels = { up = '↑', down = '↓', left = '←', right = '→', select = '↵', back = '⌫' }

-- Extra game controls to block while the menu is open (pause menu, frontend cancel)..
Config.BlockedControls = { 199, 200, 202 }

-- Turn whole sections on or off. Set dealers = false if you do not run qb-drugs.
Config.Sections = {
    admin    = true,
    players  = true,
    server   = true,
    vehicles = true,
    dealers  = true,
    dev      = true,
}

-- Permission needed for each player action (ace 'command' always passes).
Config.Permissions = {
    ['kill']        = 'admin',
    ['ban']         = 'admin',
    ['noclip']      = 'admin',
    ['kickall']     = 'admin',
    ['kick']        = 'admin',
    ['revive']      = 'admin',
    ['freeze']      = 'admin',
    ['goto']        = 'admin',
    ['spectate']    = 'admin',
    ['intovehicle'] = 'admin',
    ['bring']       = 'admin',
    ['inventory']   = 'admin',
    ['clothing']    = 'admin',
}

-- Ban lengths shown in the ban form, in seconds.
Config.BanLengths = {
    { label = '1 hour',    seconds = 3600 },
    { label = '6 hours',   seconds = 21600 },
    { label = '12 hours',  seconds = 43200 },
    { label = '1 day',     seconds = 86400 },
    { label = '3 days',    seconds = 259200 },
    { label = '1 week',    seconds = 604800 },
    { label = '1 month',   seconds = 2678400 },
    { label = '3 months',  seconds = 8035200 },
    { label = '6 months',  seconds = 16070400 },
    { label = '1 year',    seconds = 32140800 },
    { label = 'Permanent', seconds = 99999999999 },
}

-- Groups shown in the permissions form. value must be a rank your qb-core knows.
Config.Groups = {
    { value = 'user',  label = 'User',  desc = 'Regular player, no staff tools' },
    { value = 'admin', label = 'Admin', desc = 'Menu, kick, ban, teleport' },
    { value = 'god',   label = 'God',   desc = 'Full access, permissions, kick all' },
}
