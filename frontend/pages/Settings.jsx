import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { Banner, Button, Card, DataTable, Page, Select, Text, TextField } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Settings() {

  const { t } = useTranslation();
  const fetch = useAuthenticatedFetch();

  // Estos son los tipos posibles y sus valores en el campo de texto.
  const dataTypes = new Map();
  dataTypes.set('string', 'text');
  dataTypes.set('int', 'number');
  dataTypes.set('float', 'number');
  dataTypes.set('boolean', 'text');

  const [data, setData] = useState();
  const [inputVals, setInputVals] = useState({});
  const [updatesAvailable, setUpdatesAvailable] = useState(false);
  
  const requestAllSettings = async () => {
    try {
      const req = await fetch('/api/authenticated/getAllSettings');
      if(!req.ok) {
        console.error('La aplicación ha respondido con un código distinto de 200');
        console.error(req);
        return;
      }
      const res = await req.json();
      console.log(res);
      return res;
    } catch(error) {
      console.error('No se ha podido obtener los ajustes de la aplicación, ', error);
      return;
    }
  }

  const sendSettings = async (send_data) => {
    try {
      const req = await fetch('/api/authenticated/applySettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(send_data)
      });
      if(!req.ok) {
        console.error('El servidor ha respondido con un código distinto de 200');
        return;
      }
      const res = await req.json();
      console.log(res);
      return res;
    } catch(error) {
      console.error('No se han podido enviar los nuevos ajustes', error);
      return;
    }
  };

  const getAllSettings = async () => {
    const settings = await requestAllSettings();
    if(!settings || !settings.data || settings.data.length <= 0) {
      console.error('No se ha podido obtener los ajustes de la aplicación.');
      setData([]);
      return;
    }
    setUpdatesAvailable(settings.updates);
    setData(settings.data);
  }

  const submitSettings = async () => {
    if(!inputVals) return;
    await sendSettings(inputVals);
    console.log('Submit Settings!');
  };

  const generateRows = (settings) => {
    const result = [];
    settings.forEach((setting) => {
      result.push([setting.name, setting.description, setting.type, setting.type == 'boolean' ? 
        <Select options={[
          { label: 'True', value: 'true' },
          { label: 'False', value: 'false' }
        ]}
        value={inputVals[setting.name] ? inputVals[setting.name] : setting.value}
        onChange={(val) => {
          const clone = {...inputVals};
          clone[setting.name] = val;
          setInputVals(clone);
        }}/>
        : <TextField value={inputVals[setting.name] ? inputVals[setting.name] : setting.value} onChange={(val) => {
        const clone = {...inputVals};
        clone[setting.name] = val;
        setInputVals(clone);
      }}
      type={dataTypes.get(setting.type) ? dataTypes.get(setting.type) : 'text'}/>])
    });
    return result;
  };

  const requestInstallSettings = async () => {
    try {
      console.log("Requestion settings installer...");
      const req = await fetch("/api/authenticated/runSettingsInstaller", {
        method: "POST"
      });
      if(!req.ok) {
        console.error("Settings installer return an error, please check the app's logs.");
        console.error(req);
        const text = await req.text();
        console.error(text);
        return false;
      }
      return true;
    } catch(error) {
      console.error("Failed to run settings installer, ", error);
      return false;
    }
  };

  const handleInstallSettings = async () => {
    console.log("Installing settings...");
    const result = await requestInstallSettings();
    if(result) {
      console.log("Settings installed!");
      await getAllSettings();
    }
  };

  const requestUpdateSettings = async () => {
    try {
      console.log("Requestion settings updater...");
      const req = await fetch("/api/authenticated/runSettingsUpdater", {
        method: "POST"
      });
      if(!req.ok) {
        console.error("Settings updater return an error, please check the app's logs.");
        console.error(req);
        const text = await req.text();
        console.error(text);
        return false;
      }
      return true;
    } catch(error) {
      console.error("Failed to run settings updater, ", error);
      return false;
    }
  };

  const handleUpdateSettings = async () => {
    console.log("Updating settings...");
    const result = await requestUpdateSettings();
    if(result) {
      console.log("Settings updated!");
      await getAllSettings();
    }
  };

  const rows = data ? generateRows(data) : [];

  useEffect(() => {
    getAllSettings();
  }, []);

  return (
    <Page title="Upango App Settings" primaryAction={
      {
        content: t('Settings.save_changes'),
        onAction: submitSettings
      }
    }>
      {
        data && data.length <= 0 ? <>
        <Banner title={t('Settings.settings_missing')} action={{ content: t('Settings.install_settings'), onAction: handleInstallSettings }} tone="critical">{t('Settings.no_settings')}</Banner>
        <br />
        </> : <></>
      }
      {
        data && data.length > 0 && updatesAvailable ? <>
        <Banner title={t('Settings.updates_available')} action={{ content: t('Settings.install_updates'), onAction: handleUpdateSettings }} tone="info">{t('Settings.updates_text')}</Banner>
        <br />
        </> : <></>
      }
      <Card padding="0">
        <DataTable
        headings={[
          t('Settings.name'),
          t('Settings.description'),
          t('Settings.type'),
          t('Settings.value')
        ]}
        rows={rows}
        columnContentTypes={[
          'text',
          'text',
          'text',
          'text'
        ]}
        />
      </Card>
    </Page>
  )
}