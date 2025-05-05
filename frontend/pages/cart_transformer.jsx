import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { BlockStack, Card, Page, TextField, Text, Banner, Button } from "@shopify/polaris"
import { useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";

export default function CartTransformerPage() {

  const fetch = useAuthenticatedFetch();
  const { t } = useTranslation();

  const [cartTransformId, setCartTransformId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [recargos, setRecargos] = useState("");

  async function requestCartTransformId() {
    try {
      const req = await fetch('/api/authenticated/getCartTransformerID');
      if(!req.ok) {
        console.error('La aplicación ha respondido con un código distinto de 200.');
        console.error(req);
        return;
      }
      const res = await req.json();
      console.log(res);
      return res.id;
    } catch(error) {
      console.error('No se ha podido realizar la request para obtener el ID del cart transformer, ', error);
      return;
    }
  }

  async function requestCartTransfomerMetafield() {
    try {
      const req = await fetch('/api/authenticated/getCartTransformerMetafield');
      if(!req.ok) {
        console.error('La aplicación ha respondido con un código distinto de 200.');
        console.error(req);
        return;
      }
      const res = await req.json();
      console.log(res);
      return res.value;
    } catch(error) {
      console.error('No se ha podido realizar la request para obtener el metafield del cart transformer, ', error);
      return;
    }
  }

  async function requestCartTransformerMetafieldChange() {
    try {
      const req = await fetch('/api/authenticated/setCartTransformerMetafield', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: recargos
        })
      });
      if(!req.ok) {
        console.error('La aplicación ha respondido con un código distinto de 200.');
        console.error(req);
        return false;
      }
      const res = await req.json();
      console.log(res);
      return true;
    } catch(error) {
      console.error('No se ha podido realizar la request para cambiar el cart transformer, ', error);
      return false;
    }
  }

  async function main() {
    const transformerId = await requestCartTransformId();
    setIsLoading(false);
    if(!transformerId) {
      setFailed(true);
      console.error('No se ha podido obtener el ID del cart transformer.');
      return;
    }
    setCartTransformId(transformerId);
    const metafieldValue = await requestCartTransfomerMetafield();
    if(!metafieldValue) {
      setFailed(true);
      console.errorU('Algo fue mal intentando obtener los datos del metafield del transformador de carrito.');
      return;
    }
    setRecargos(metafieldValue);
  }

  useEffect(() => {
    main();
  }, [])

  return (<Page>
    <BlockStack gap="300">
      {failed ? 
      <>
        <Banner tone="critical">{t('Transformer.error')}</Banner>
      </>
      : <></>}
      {
        isLoading ? 
        <>
          <Banner tone="warning">{t('Transformer.loading')}</Banner>
        </>: <></>
      }
      <Card>
        <BlockStack gap="400">
          <Text>{t('Transformer.id_value')}"{cartTransformId}"</Text>
          <TextField value={recargos} onChange={setRecargos}></TextField>
          <Button variant="primary" disabled={failed} onClick={requestCartTransformerMetafieldChange}>{t('Transformer.save')}</Button>
        </BlockStack>
      </Card>
      <Card>
        <Text>{t('Transformer.explanation.line1')}<br/>
        {t('Transformer.explanation.line2')}<br/>
        {t('Transformer.explanation.line3')}
        </Text>
      </Card>
    </BlockStack>
  </Page>);
}