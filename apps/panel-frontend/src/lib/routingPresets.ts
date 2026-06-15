import { ROUTING_PRESET_IDS, type RoutingPresetId } from '@iceslab/shared';

type Translate = (key: string) => string;

const ROUTING_PRESET_TRANSLATION_KEYS: Record<
  RoutingPresetId,
  { label: string; description: string; squadLabel: string }
> = {
  'proxy-all': {
    label: 'settings.subscription.routingProxyAll',
    description: 'settings.subscription.routingProxyAllDesc',
    squadLabel: 'squads.form.routingProxyAll',
  },
  'ru-split': {
    label: 'settings.subscription.routingRuSplit',
    description: 'settings.subscription.routingRuSplitDesc',
    squadLabel: 'squads.form.routingRuSplit',
  },
  roscomvpn: {
    label: 'settings.subscription.routingRoscomVpn',
    description: 'settings.subscription.routingRoscomVpnDesc',
    squadLabel: 'squads.form.routingRoscomVpn',
  },
};

export function routingPresetRadioOptions(t: Translate): {
  value: RoutingPresetId;
  label: string;
  description: string;
}[] {
  return ROUTING_PRESET_IDS.map((value) => {
    const keys = ROUTING_PRESET_TRANSLATION_KEYS[value];
    return {
      value,
      label: t(keys.label),
      description: t(keys.description),
    };
  });
}

export function routingPresetSelectOptions(t: Translate): {
  value: string;
  label: string;
}[] {
  return [
    { value: '', label: t('squads.form.routingInherit') },
    ...ROUTING_PRESET_IDS.map((value) => {
      const keys = ROUTING_PRESET_TRANSLATION_KEYS[value];
      return { value, label: t(keys.squadLabel) };
    }),
  ];
}
