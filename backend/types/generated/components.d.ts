import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksRichText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rich_texts';
  info: {
    displayName: 'RichText';
    icon: 'quote';
  };
  attributes: {
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.rich-text': BlocksRichText;
    }
  }
}
