import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

export default function Galery() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout>
            <main className={styles.galeryContainer}>
                <h1>Galería</h1>
                <h2>Primeros pasos</h2>
                <p>
                    Primera vez que Pepperoni se desplaza sobre sus ruedas.
                </p>
                <div className={styles.videoContainer}>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/WIlDZOEus2Y?si=ot-74SH7PLu35TPs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
                <h2>Test de spinner</h2>
                <p>
                    Primer test de giro del spinner de Pepperoni llegando a una velocidad del 40% de la velocidad máxima.
                </p>
                <div className={styles.videoContainer}>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/U2f0mU5--3Y?si=_eB2Z7NrSAWHZcif" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
            </main>
        </Layout>
    )
  }