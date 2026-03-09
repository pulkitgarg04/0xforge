const { ipcMain, app } = require('electron');
const fs = require('fs');
const path = require('path');

const getSettingsPath = () => path.join(app.getPath('userData'), 'settings.json');

function setupStoreHandlers() {
    ipcMain.handle('store:get', async (_event, key) => {
        try {
            const settingsPath = getSettingsPath();
            // console.log('Settings path:', settingsPath);

            if (!fs.existsSync(settingsPath)) return null;

            const data = await fs.promises.readFile(settingsPath, 'utf-8');
            const settings = JSON.parse(data);

            return key ? settings[key] : settings;
        } catch (error) {
            console.error('Failed to read settings:', error);
            return null;
        }
    });

    ipcMain.handle('store:set', async (_event, key, value) => {
        try {
            const settingsPath = getSettingsPath();

            let settings = {};
            if (fs.existsSync(settingsPath)) {
                const data = await fs.promises.readFile(settingsPath, 'utf-8');
                settings = JSON.parse(data);
            }

            settings[key] = value;

            await fs.promises.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');

            return true;
        } catch (error) {
            console.error('Failed to write settings:', error);
            return false;
        }
    });
}

module.exports = { setupStoreHandlers };
