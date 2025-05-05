import { useTranslation } from "react-i18next";
import { Page, Card, DataTable, Badge, BlockStack, Button, InlineStack, Text, Banner } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "@shopify/app-bridge-react";

export default function Metafields() {
  const fetch = useAuthenticatedFetch();
  const { t } = useTranslation();

  const [metafieldRows, setMetafieldRows] = useState([]);
  const [metaobjectRows, setMetaobjectRows] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [badgeText, setBadgeText] = useState("Loading...");
  const [badgeTone, setBadgetTone] = useState("info");

  /**
   * 
   * @returns {Promise<{metafields: any[], metaobjects: any[], missing_metafields: any[], missing_metaobjects: any[]}>}
   */
  const getRequirementsInfo = async () => {
    try {
      const req = await fetch("/api/authenticated/getMetafieldsCreated");
      if(!req.ok) {
        console.error('La aplicación ha respondido con un código distinto de 200');
        console.error(req);
        setErrorMessage(t('Metafields.Error_messages.metafield_get_error'));
        return;
      }
      const res = await req.json();
      setErrorMessage("");
      return res.data;
    } catch(error) {
      console.error('No se pudo obtener información sobre los metafields de la aplicación');
      setErrorMessage(t('Metafields.Error_messages.backend_error'));
      return;
    }
  };

  const handleRequirementsInfo = async () => {
    const data = await getRequirementsInfo();
    if(!data) {
      // TODO: Poner un abnner informando de un error.
      return;
    }
    console.log(data);
    // Ahora vamos a rellenar los datos de la tabla de metafields.
    const metafieldResult = [];
    data.metafields.forEach((metafield) => {
      metafieldResult.push([metafield.name, metafield.namespace, metafield.key, metafield.description, metafield.ownerType, <Badge tone="success">{t('Metafields.created')}</Badge>])
    });
    data.missing_metafields.forEach((metafield) => {
      metafieldResult.push([metafield.name, metafield.namespace, metafield.key, metafield.description, metafield.ownerType, <Badge tone="critical">{t('Metafields.missing')}</Badge>])
    });
    setMetafieldRows(metafieldResult);
    // Ahora vamos a rellenar los datos de la tabla de metaobjetos.
    const metaobjectResult = [];
    data.metaobjects.forEach((metaobject) => {
      metaobjectResult.push([metaobject.name, metaobject.type, metaobject.description, <Badge tone="success">{t('Metafields.created')}</Badge>]);
    });
    data.missing_metaobjects.forEach((metaobject) => {
      metaobjectResult.push([metaobject.name, metaobject.type, metaobject.description, <Badge tone="critical">{t('Metafields.missing')}</Badge>]);
    });
    setMetaobjectRows(metaobjectResult);
    if(data.missing_metafields.length == 0 && data.missing_metaobjects.length == 0) {
      setBadgetTone("success");
      setBadgeText(t('Metafields.created'))
    } else {
      setBadgetTone("attention")
      setBadgeText(t('Metafields.missing'));
    }
  };

  const createMetafields = async () => {
    setInfoMessage(t('Metafields.Info_messages.creating_metafields'));
    const req = await fetch('/api/authenticated/createMetafields', {
      method: 'POST'
    });
    setInfoMessage("");
    if(!req.ok) {
      console.error('No se ha podido crear los metafields, la aplicación respondió con un código distinto de 200.');
      setErrorMessage(t('Metafields.Error_messages.metafield_create_error'));
      return;
    }
    const res = await req.json();
    console.log(res);
    setErrorMessage("");
    return;
  };

  const handleCreateMetafields = async () => {
    await createMetafields();
    await handleRequirementsInfo();
  }

  const createCronTask = async () => {
    try {
      setInfoMessage(t('Metafields.Info_messages.creating_cron_task'));
      const req = await fetch('/api/authenticated/startCronTask', {
        method: 'POST'
      });
      if(!req.ok) {
        setInfoMessage("");
        console.error('La aplicación ha respondido con un código distinto de 200');
        setErrorMessage(t('Metafields.Error_messages.cron_task_error'));
        console.error(req);
        return;
      }
      const res = await req.json();
      setInfoMessage("");
      console.log(res);
      setErrorMessage("");
      return res;
    } catch(error) {
      setInfoMessage("");
      console.error('Error al crear la tarea de cron', error);
      setErrorMessage(t('Metafields.Error_messages.backend_error'))
      return;
    }
  };
  

  useEffect(() => {
    handleRequirementsInfo();
  }, []);

  return (
    <Page title={t('Metafields.title')} primaryAction={{content: t('Metafields.Buttons.create_metafield'), onAction: handleCreateMetafields}}
    secondaryActions={[
      {
        content: t('Metafields.create_cron'),
        onAction: createCronTask
      }
    ]}
    titleMetadata={<Badge tone={badgeTone}>{badgeText}</Badge>}
    backAction={{
      onAction: () => { window.history.back() }
    }}>
      {
        infoMessage ?
        <>
          <Banner tone="info">{infoMessage}</Banner>
          <br />
        </>
        :
        undefined
      }
      {
        errorMessage ?
        <>
          <Banner tone="critical">{errorMessage}</Banner>
          <br/>
        </> 
        :
        undefined
      }
      <BlockStack gap="200">
        <Text as="h2" variant="bodyLg" fontWeight="bold">{t('Metafields.application_metafields')}</Text>
        <Card padding={0}>
          <DataTable
          columnContentTypes={[
            'text',
            'text',
            'text',
            'text',
            'text'
          ]}
          headings={[
            t('Metafields.Metafield_rows.name'),
            t('Metafields.Metafield_rows.namespace'),
            t('Metafields.Metafield_rows.key'),
            t('Metafields.Metafield_rows.description'),
            t('Metafields.Metafield_rows.owner_type'),
            t('Metafields.Metafield_rows.status')
          ]}
          rows={metafieldRows}/>
        </Card>
        <br />
        <Text as="h2" variant="bodyLg" fontWeight="bold">{t('Metafields.application_metaobjects')}</Text>
        <Card padding={0}>
          <DataTable
          columnContentTypes={[
            'text',
            'text',
            'text',
            'text',
            'text'
          ]}
          headings={[
            t('Metafields.Metaobject_rows.name'),
            t('Metafields.Metaobject_rows.type'),
            t('Metafields.Metaobject_rows.description'),
            t('Metafields.Metaobject_rows.status')
          ]}
          rows={metaobjectRows}/>
        </Card>
      </BlockStack>
    </Page>
  )
}