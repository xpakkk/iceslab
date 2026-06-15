import type { RoutingPresetId } from '@iceslab/shared';

const PROXY_GROUP = 'Auto';

const DIRECT_DOH_NAMESERVERS = [
  'https://1.1.1.1/dns-query',
  'https://8.8.8.8/dns-query',
] as const;

function maybeViaProxy(nameserver: string, hasProxyGroup: boolean): string {
  return hasProxyGroup ? `${nameserver}#${PROXY_GROUP}` : nameserver;
}

export function buildProxyAllDnsLines(hasProxyGroup: boolean): string[] {
  return [
    'mode: rule',
    'ipv6: false',
    'dns:',
    '  enable: true',
    '  listen: 0.0.0.0:1053',
    '  ipv6: false',
    '  enhanced-mode: redir-host',
    '  default-nameserver:',
    '    - 1.1.1.1',
    '    - 8.8.8.8',
    '  proxy-server-nameserver:',
    '    - 1.1.1.1',
    '    - 8.8.8.8',
    '  nameserver:',
    ...DIRECT_DOH_NAMESERVERS.map((ns) => `    - ${maybeViaProxy(ns, hasProxyGroup)}`),
    '',
  ];
}

/**
 * `ru-split` keeps the original GeoSite/GeoIP approach for all full-config
 * formats. The remote .dat URLs are intentionally left in `clash.ts`'s
 * companion output to preserve the existing behavior byte-for-byte except for
 * the newly-added proxy-all DNS block.
 */
export const RU_SPLIT_DNS_LINES: readonly string[] = [
  'dns:',
  '  enable: true',
  '  enhanced-mode: fake-ip',
  '  fake-ip-range: 198.18.0.1/16',
  '  fake-ip-filter:',
  '    - "*.lan"',
  '    - "+.local"',
  '  default-nameserver:',
  '    - 77.88.8.8',
  '    - 1.1.1.1',
  '  proxy-server-nameserver:',
  '    - 77.88.8.8',
  '    - 1.1.1.1',
  '  nameserver:',
  '    - https://1.1.1.1/dns-query',
  '    - https://dns.google/dns-query',
  '  nameserver-policy:',
  '    "geosite:category-ru": 77.88.8.8',
  '    "geosite:category-gov-ru": 77.88.8.8',
  '',
];

export const RU_SPLIT_RULE_LINES: readonly string[] = [
  '  - GEOSITE,category-ads-all,REJECT',
  '  - GEOSITE,category-ru,DIRECT',
  '  - GEOSITE,category-gov-ru,DIRECT',
  '  - IP-CIDR,10.0.0.0/8,DIRECT,no-resolve',
  '  - IP-CIDR,172.16.0.0/12,DIRECT,no-resolve',
  '  - IP-CIDR,192.168.0.0/16,DIRECT,no-resolve',
  '  - IP-CIDR,127.0.0.0/8,DIRECT,no-resolve',
  '  - IP-CIDR,169.254.0.0/16,DIRECT,no-resolve',
  '  - IP-CIDR6,fc00::/7,DIRECT,no-resolve',
  '  - IP-CIDR6,fe80::/10,DIRECT,no-resolve',
  '  - IP-CIDR6,::1/128,DIRECT,no-resolve',
  '  - GEOIP,RU,DIRECT',
];

const ROSCOMVPN_BASE = 'https://cdn.jsdelivr.net/gh/hydraponique';

type RoscomRuleProviderSpec = {
  name: string;
  behavior: 'domain' | 'ipcidr';
  repository: 'roscomvpn-geosite' | 'roscomvpn-geoip';
  file: string;
  path: string;
  intervalSeconds?: number;
};

const ROSCOMVPN_RULE_PROVIDER_SPECS: readonly RoscomRuleProviderSpec[] = [
  {
    name: 'private-domains',
    behavior: 'domain',
    repository: 'roscomvpn-geosite',
    file: 'private.mrs',
    path: './ruleset/roscomvpn-geosite-private.mrs',
    intervalSeconds: 2592000,
  },
  {
    name: 'category-ru',
    behavior: 'domain',
    repository: 'roscomvpn-geosite',
    file: 'category-ru.mrs',
    path: './ruleset/roscomvpn-category-ru.mrs',
  },
  {
    name: 'whitelist',
    behavior: 'domain',
    repository: 'roscomvpn-geosite',
    file: 'whitelist.mrs',
    path: './ruleset/roscomvpn-whitelist.mrs',
  },
  {
    name: 'microsoft',
    behavior: 'domain',
    repository: 'roscomvpn-geosite',
    file: 'microsoft.mrs',
    path: './ruleset/roscomvpn-microsoft.mrs',
  },
  {
    name: 'apple',
    behavior: 'domain',
    repository: 'roscomvpn-geosite',
    file: 'apple.mrs',
    path: './ruleset/roscomvpn-apple.mrs',
  },
  {
    name: 'google-play',
    behavior: 'domain',
    repository: 'roscomvpn-geosite',
    file: 'google-play.mrs',
    path: './ruleset/roscomvpn-google-play.mrs',
  },
  {
    name: 'github',
    behavior: 'domain',
    repository: 'roscomvpn-geosite',
    file: 'github.mrs',
    path: './ruleset/roscomvpn-github.mrs',
  },
  {
    name: 'youtube',
    behavior: 'domain',
    repository: 'roscomvpn-geosite',
    file: 'youtube.mrs',
    path: './ruleset/roscomvpn-youtube.mrs',
  },
  {
    name: 'telegram',
    behavior: 'domain',
    repository: 'roscomvpn-geosite',
    file: 'telegram.mrs',
    path: './ruleset/roscomvpn-telegram.mrs',
  },
  {
    name: 'twitch',
    behavior: 'domain',
    repository: 'roscomvpn-geosite',
    file: 'twitch.mrs',
    path: './ruleset/roscomvpn-twitch.mrs',
  },
  {
    name: 'pinterest',
    behavior: 'domain',
    repository: 'roscomvpn-geosite',
    file: 'pinterest.mrs',
    path: './ruleset/roscomvpn-pinterest.mrs',
  },
  {
    name: 'category-ads',
    behavior: 'domain',
    repository: 'roscomvpn-geosite',
    file: 'category-ads.mrs',
    path: './ruleset/roscomvpn-category-ads.mrs',
  },
  {
    name: 'win-spy',
    behavior: 'domain',
    repository: 'roscomvpn-geosite',
    file: 'win-spy.mrs',
    path: './ruleset/roscomvpn-win-spy.mrs',
  },
  {
    name: 'private-ips',
    behavior: 'ipcidr',
    repository: 'roscomvpn-geoip',
    file: 'private.mrs',
    path: './ruleset/roscomvpn-geoip-private.mrs',
    intervalSeconds: 2592000,
  },
  {
    name: 'direct-ips',
    behavior: 'ipcidr',
    repository: 'roscomvpn-geoip',
    file: 'direct.mrs',
    path: './ruleset/roscomvpn-direct-ips.mrs',
  },
];

/**
 * Conservative Mihomo subset of hydraponique's RoscomVPN template. Iceslab owns
 * the proxy groups, so app-specific/process-specific provider groups from the
 * upstream template are left out here; core direct/block/proxy rule-sets stay
 * updateable client-side via rule-providers.
 */
function roscomRuleProviderUrl(spec: RoscomRuleProviderSpec): string {
  return `${ROSCOMVPN_BASE}/${spec.repository}/release/mihomo/${spec.file}`;
}

export function buildRoscomRuleProviderLines(): string[] {
  const lines = ['rule-providers:'];
  for (const spec of ROSCOMVPN_RULE_PROVIDER_SPECS) {
    lines.push(
      `  ${spec.name}:`,
      '    type: http',
      `    behavior: ${spec.behavior}`,
      '    format: mrs',
      `    url: ${roscomRuleProviderUrl(spec)}`,
      `    path: ${spec.path}`,
      `    proxy: ${PROXY_GROUP}`,
      `    interval: ${spec.intervalSeconds ?? 86400}`,
    );
  }
  return lines;
}

export function buildRoscomDnsLines(hasProxyGroup: boolean): string[] {
  return [
    'mode: rule',
    'ipv6: false',
    'dns:',
    '  enable: true',
    '  listen: 0.0.0.0:1053',
    '  ipv6: false',
    '  enhanced-mode: fake-ip',
    '  fake-ip-range: 198.18.0.1/16',
    '  fake-ip-filter:',
    '    - rule-set:private-domains',
    '    - "*.lan"',
    '    - "+.local"',
    '  default-nameserver:',
    '    - 77.88.8.8',
    '    - 1.1.1.1',
    '  proxy-server-nameserver:',
    '    - 1.1.1.1',
    '    - 8.8.8.8',
    '  direct-nameserver:',
    '    - 77.88.8.8',
    '    - 8.8.8.8',
    '  nameserver:',
    ...DIRECT_DOH_NAMESERVERS.map((ns) => `    - ${maybeViaProxy(ns, hasProxyGroup)}`),
    '',
  ];
}

export const ROSCOMVPN_RULE_LINES: readonly string[] = [
  '  - RULE-SET,private-ips,DIRECT,no-resolve',
  '  - AND,((NETWORK,UDP),(DST-PORT,443)),REJECT',
  '  - RULE-SET,private-domains,DIRECT',
  '  - RULE-SET,category-ads,REJECT',
  '  - RULE-SET,win-spy,REJECT',
  '  - RULE-SET,google-play,Auto',
  '  - RULE-SET,youtube,Auto',
  '  - RULE-SET,telegram,Auto',
  '  - RULE-SET,github,Auto',
  '  - RULE-SET,twitch,DIRECT',
  '  - RULE-SET,microsoft,DIRECT',
  '  - RULE-SET,apple,DIRECT',
  '  - RULE-SET,pinterest,DIRECT',
  '  - RULE-SET,category-ru,DIRECT',
  '  - RULE-SET,whitelist,DIRECT',
  '  - RULE-SET,direct-ips,DIRECT,no-resolve',
];

export interface ClashRoutingSections {
  headerLines: string[];
  ruleProviderLines: string[];
  ruleLines: readonly string[];
}

export function buildClashRoutingSections(
  preset: RoutingPresetId,
  hasProxyGroup: boolean,
): ClashRoutingSections {
  if (preset === 'ru-split') {
    return {
      headerLines: RU_SPLIT_DNS_LINES.slice(),
      ruleProviderLines: [],
      ruleLines: RU_SPLIT_RULE_LINES,
    };
  }

  if (preset === 'roscomvpn' && hasProxyGroup) {
    return {
      headerLines: buildRoscomDnsLines(hasProxyGroup),
      ruleProviderLines: buildRoscomRuleProviderLines(),
      ruleLines: ROSCOMVPN_RULE_LINES,
    };
  }

  return {
    headerLines: buildProxyAllDnsLines(hasProxyGroup),
    ruleProviderLines: [],
    ruleLines: [],
  };
}
