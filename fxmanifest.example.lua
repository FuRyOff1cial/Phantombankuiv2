fx_version 'cerulean'
game 'gta5'

author 'Phantom Bank Team'
description 'Modern Banking System for FiveM'
version '1.0.0'

lua54 'yes'

-- UI files
ui_page 'html/index.html'

files {
    'html/index.html',
    'html/assets/**/*'
}

-- Client scripts
client_scripts {
    'client/**/*.lua'
}

-- Server scripts
server_scripts {
    '@oxmysql/lib/MySQL.lua',  -- ou seu sistema de database
    'server/**/*.lua'
}

-- Shared scripts
shared_scripts {
    '@ox_lib/init.lua',  -- se usar ox_lib
    'shared/**/*.lua'
}

-- Dependencies (ajuste conforme seu setup)
dependencies {
    'oxmysql',  -- ou mysql-async, ghmattimysql
    'ox_lib'    -- opcional, mas recomendado
}

-- Server exports (exemplos)
exports {
    'GetPlayerBankBalance',
    'AddBankMoney',
    'RemoveBankMoney',
    'GetCreditScore'
}

-- Server exports (exemplos avançados)
server_exports {
    'CreateInvoice',
    'CancelLoan',
    'AddTransaction'
}
