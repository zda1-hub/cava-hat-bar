const image=(file:string)=>`https://www.gigipip.com/cdn/shop/files/${file}?width=800`;
// Temporary reference photos and development products, replace before launch.
export const catalog=[
 {id:'cream',name:'The Western — Cream',color:'Cream',price:138,image:image('felt-hat-cream-xs-55-wyatt-cowboy-hat-1194262666.jpg'),worn:image('felt-hat-wyatt-cowboy-hat-1194262660.jpg')},
 {id:'brown',name:'The Western — Brown',color:'Brown',price:138,image:image('felt-hat-brown-xs-55-wyatt-cowboy-hat-1194262673.jpg'),worn:image('felt-hats-wyatt-cowboy-hat-1249371554.png')},
 {id:'black',name:'The Western — Black',color:'Black',price:138,image:image('felt-hat-black-xs-55-wyatt-cowboy-hat-1194262659.jpg'),worn:image('felt-hat-wyatt-cowboy-hat-1239268937.png')},
 {id:'chocolate',name:'The Western — Chocolate',color:'Chocolate',price:148,image:image('felt-hat-wyatt-cowboy-hat-1218969449.png'),worn:image('felt-hat-wyatt-cowboy-hat-1218969445.png')},
 {id:'ivory',name:'The Cattleman — Ivory',color:'Cream',price:148,image:image('felt-hats-off-white-xs-55-teddy-cattleman-41440116899971.jpg'),worn:image('felt-hats-teddy-cattleman-cowboy-hat-1192136011.jpg')},
 {id:'beige',name:'The Cattleman — Beige',color:'Beige',price:148,image:image('felt-hats-cream-xs-55-teddy-cattleman-41440116867203.jpg'),worn:image('felt-hats-teddy-cattleman-cowboy-hat-1239268944.png')},
];
