import styler from 'motion-style'
import browser from 'detect-browser'
import event from 'disposable-event'
import { CompositeDisposable } from 'sb-event-kit'
import { Component } from 'react'

const style = styler()

export default function ComponentDecorate(component) {
  class ProxyComponent {
    constructor(...parameters) {
      this.subscriptions = new CompositeDisposable()
      Component.apply(this, parameters)
      component.apply(this, parameters)
    }
    componentWillUnmount() {
      this.subscriptions.dispose()
      if (component.prototype.componentWillUnmount) {
        component.prototype.componentWillUnmount.call(this)
      }
    }
    addEvent = (...args) => {
      const e = event(...args)
      this.subscriptions.add(e)
      return e
    }
  }

  if (browser.name !== 'safari') {
    Object.defineProperty(ProxyComponent, 'name', {
      get() {
        return component.name
      },
    })
  }

  // set static properties
  Object.keys(component).forEach(staticProp => {
    ProxyComponent[staticProp] = component[staticProp]
  })

  Object.setPrototypeOf(component.prototype, Component.prototype)
  Object.setPrototypeOf(ProxyComponent.prototype, component.prototype)

  return style(ProxyComponent)
}
