import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksCard extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cards';
  info: {
    displayName: 'Card';
    icon: 'information';
  };
  attributes: {
    Question: Schema.Attribute.String;
    Text: Schema.Attribute.Text;
  };
}

export interface BlocksHeader extends Struct.ComponentSchema {
  collectionName: 'components_blocks_headers';
  info: {
    displayName: 'Header';
    icon: 'layout';
  };
  attributes: {
    Subtext: Schema.Attribute.String;
    Title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksIFrame extends Struct.ComponentSchema {
  collectionName: 'components_blocks_i_frames';
  info: {
    displayName: 'iFrame';
    icon: 'pinMap';
  };
  attributes: {
    iFrame: Schema.Attribute.String;
  };
}

export interface BlocksOpeningHour extends Struct.ComponentSchema {
  collectionName: 'components_blocks_opening_hours';
  info: {
    displayName: 'OpeningHour';
    icon: 'clock';
  };
  attributes: {
    Open: Schema.Attribute.JSON;
  };
}

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

export interface BlocksRichTextImage extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rich_text_images';
  info: {
    description: '';
    displayName: 'RichText + Image';
    icon: 'apps';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Text: Schema.Attribute.Blocks;
    Title: Schema.Attribute.String;
  };
}

export interface BlocksWhy extends Struct.ComponentSchema {
  collectionName: 'components_blocks_whies';
  info: {
    description: '';
    displayName: 'Why';
    icon: 'question';
  };
  attributes: {
    FirstCard: Schema.Attribute.Component<'blocks.why-card', false>;
    SecondCard: Schema.Attribute.Component<'blocks.why-card', false>;
    ThirdCard: Schema.Attribute.Component<'blocks.why-card', false>;
  };
}

export interface BlocksWhyCard extends Struct.ComponentSchema {
  collectionName: 'components_blocks_why_cards';
  info: {
    description: '';
    displayName: 'WhyCard';
    icon: 'question';
  };
  attributes: {
    Icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Text: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.card': BlocksCard;
      'blocks.header': BlocksHeader;
      'blocks.i-frame': BlocksIFrame;
      'blocks.opening-hour': BlocksOpeningHour;
      'blocks.rich-text': BlocksRichText;
      'blocks.rich-text-image': BlocksRichTextImage;
      'blocks.why': BlocksWhy;
      'blocks.why-card': BlocksWhyCard;
    }
  }
}
