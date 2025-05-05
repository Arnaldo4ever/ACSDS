import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  LegacyStack,
  Link,
  Text,
  Button,
} from "@shopify/polaris";
import { TitleBar, useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { logoUpango } from "../assets";
import React from "react";

//import { CreateCarrierServiceCard, TraduccionesCard, ProductsCard } from "../components";

export default function HomePage() {
  const { t } = useTranslation();
  const fetch = useAuthenticatedFetch();

  const createMetafieldsRequest = async () => {
    try {
      const req = await fetch("/api/authenticated/create-metafields", {
        method: "POST",
      });
      if (!req.ok) {
        console.error(
          "El servidor ha respondido con un código distinto de 200"
        );
        const res = await req.json();
        console.log(res);
        return;
      }
      console.log("Metafields Creados satisfactoriamente.");
      return;
    } catch (error) {
      console.error(
        "No se ha podido realizar la request para crear metafields, ",
        error
      );
      return;
    }
  };

  return (
    <Page narrowWidth>
      <TitleBar title={t("HomePage.title")} primaryAction={null} />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <LegacyStack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <LegacyStack.Item fill>
                <TextContainer spacing="loose">
                  <Text as="h2" variant="headingMd">
                    {t("HomePage.heading")}
                  </Text>
                  <p>{React.version}</p>
                  <p>{t("HomePage.appDescription")}</p>
                  <p>
                    <Trans
                      i18nKey="HomePage.appByUpango"
                      components={{
                        UpangoLink: <Link url="https://upango.es" external />,
                      }}
                    />
                  </p>
                </TextContainer>
              </LegacyStack.Item>
              <LegacyStack.Item>
                <div style={{ padding: "0 20px" }}>
                  <Image
                    source={logoUpango}
                    alt={t("HomePage.upangoAltText")}
                    width={120}
                  />
                </div>
              </LegacyStack.Item>
            </LegacyStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
