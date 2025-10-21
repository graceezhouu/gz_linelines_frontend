import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FeatureCard from '../FeatureCard.vue'

describe('FeatureCard', () => {
  it('renders feature information correctly', () => {
    const feature = {
      name: 'Queue Management',
      description: 'Create and manage queues for events and venues',
      icon: 'Queue',
      color: 'blue'
    }

    const wrapper = mount(FeatureCard, {
      props: { feature }
    })

    expect(wrapper.text()).toContain('Queue Management')
    expect(wrapper.text()).toContain('Create and manage queues for events and venues')
  })

  it('emits click event when clicked', async () => {
    const feature = {
      name: 'Test Feature',
      description: 'Test description',
      icon: 'Queue',
      color: 'blue'
    }

    const wrapper = mount(FeatureCard, {
      props: { feature }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
