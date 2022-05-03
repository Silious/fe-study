import React, { useInsertionEffect, useEffect, useLayoutEffect } from 'react'
//useEffect useLayoutEffect UseInsertionEffect
function UseInsertionEffectPage() {
  //只一个用途，就是用在css in js库里 styled-components
  useInsertionEffect(() => {
    console.log('useInsertionEffect');
    let rule = `.container{
      background-color:green;
  }`;
    document.head.appendChild(getStyleForRule(rule));
  });
  useEffect(() => {
    console.log('useEffect');
  })
  useLayoutEffect(() => {
    console.log('useLayoutEffect');
  })
  return <div className={'container'} >hello</div>;
}
function getStyleForRule(rule) {
  let style = document.createElement('style');
  style.innerHTML = rule;
  return style;
}
export default UseInsertionEffectPage