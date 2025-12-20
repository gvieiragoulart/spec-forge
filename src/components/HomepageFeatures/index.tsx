import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
  icon: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: '🔗 Route Aliases',
    icon: '🔗',
    description: (
      <>
        Define multiple path aliases for the same endpoint, making your API more
        flexible and easier to migrate between versions without breaking existing clients.
      </>
    ),
  },
  {
    title: '🏷️ Custom Tags',
    icon: '🏷️',
    description: (
      <>
        Organize your API operations with rich custom tags that include categories,
        colors, icons, and descriptions for better documentation and discoverability.
      </>
    ),
  },
  {
    title: '🔐 Permission Flags',
    icon: '🔐',
    description: (
      <>
        Document required permissions, roles, and scopes directly in your OpenAPI spec,
        making authorization requirements clear for developers and security teams.
      </>
    ),
  },
  {
    title: '✅ OpenAPI Compatible',
    icon: '✅',
    description: (
      <>
        Fully compatible with OpenAPI v3 standard. All extensions use the x-* prefix
        pattern, ensuring compatibility with existing OpenAPI tools and validators.
      </>
    ),
  },
  {
    title: '⚡ TypeScript First',
    icon: '⚡',
    description: (
      <>
        Built with TypeScript for type safety and excellent developer experience.
        Get autocomplete and type checking for all OpenAPI and extension fields.
      </>
    ),
  },
  {
    title: '📚 Rich Documentation',
    icon: '📚',
    description: (
      <>
        Powered by Docusaurus and React, generate beautiful, interactive documentation
        from your extended OpenAPI specifications with zero configuration.
      </>
    ),
  },
];

function Feature({title, description, icon}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureIcon}>{icon}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
