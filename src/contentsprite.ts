/// <reference path="sprite.ts" />
/// <reference path="content.ts" />

module CityGame
{
  export class ContentSprite extends Sprite
  {
    content: Content;

    constructor(type, content, frameIndex: number)
    {
      this.content = content;
      super(type, frameIndex);
    }
  }
}
