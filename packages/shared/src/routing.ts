/**
 * Routing Templates (design plan E, R1a): panel-wide preset controlling the
 * routing rules emitted into full-config subscription formats. URI-list
 * formats (plain) and wgconf carry no routing section, so the preset does not
 * apply to them. Presets may be format-scoped when client ecosystems support
 * different routing primitives.
 *
 *   - `proxy-all`: everything through the tunnel. Legacy behaviour; output
 *     is byte-identical to pre-R1 builds.
 *   - `ru-split` : ads/malware blocked, RU domains + RU IPs + private ranges
 *     direct, everything else (including blocked sites) through the tunnel.
 *   - `roscomvpn`: Mihomo/Clash preset backed by hydraponique RoscomVPN .mrs
 *     rule-providers. Russian/direct resources stay direct, blocked and non-RU
 *     traffic goes through the tunnel, rule sets refresh client-side. Other
 *     full-config formats intentionally fall back to proxy-all until they have
 *     format-native RoscomVPN parity.
 *
 * Stored in AppSetting under `subscriptionRoutingPreset`; overridable per
 * request via `?routing=` on /sub (mirrors the `bundle` param pattern).
 */
export const ROUTING_PRESET_IDS = ['proxy-all', 'ru-split', 'roscomvpn'] as const;

export type RoutingPresetId = (typeof ROUTING_PRESET_IDS)[number];

export function isRoutingPresetId(value: unknown): value is RoutingPresetId {
  return (
    typeof value === 'string' &&
    (ROUTING_PRESET_IDS as readonly string[]).includes(value)
  );
}
