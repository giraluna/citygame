module CityGame
{
  export class Sprite extends PIXI.Sprite
  {
    type: string;
    content: Content;

    constructor( template, frameIndex?: number )
    {
      var frame = isFinite(frameIndex) ? template.frame[frameIndex] : template.frame;

      var _texture = PIXI.Texture.fromFrame(frame);
      super(_texture); //pixi caches and reuses the texture as needed
      
      this.type   = template.type;
      this.anchor = arrayToPoint(template.anchor);

      if (template.interactive === true)
      {
        this.interactive = true;
        this.hitArea = arrayToPolygon(template.hitArea);
      }
    }
  }
}
