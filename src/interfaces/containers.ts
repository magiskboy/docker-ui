export interface IGetListContainerParam {
  all?: boolean;
  limit?: number;
  size?: boolean;
  filters?: string;
}

export interface IPort {
  IP: string;
  PrivatePort: number;
  PublicPort: number;
  Type: 'tcp' | 'udp' | 'sctp';
}

export interface IHostConfig {
  NetworkMode: string;
}

export interface IIPAMConfig {
  IPv4Address: string;
  IPv6Address: string;
  LinkLocalIPs: string[];
}

export interface INetwork {
  IPAMConfig: IIPAMConfig;
  Links: string[];
  Aliases: string[];
  NetworkID: string;
  EndpointID: string;
  Gateway: string;
  IPAddress: string;
  IPPrefixLen: string;
  IPv6Gateway: string;
  GlobalIPv6Address: string;
  GlobalIPv6PrefixLen: string;
  MacAddress: string;
  DriverOpts: Map<string, string>;
}

export interface IBindOptions {
  Propagation: 'private' | 'rprivate' | 'shared' | 'slave' | 'rslave';
  NonRecusive: boolean;
}

export interface IDriveConfig {
  name: string;
  options: Map<string, string>;
}

export interface IVolumeOptions {
  NoCopy: boolean;
  Labels: Map<string, string>;
  DriverConfig: IDriveConfig;
}

export interface ITmpfsOptions {
  SizeBytes: number;
  Mode: number;
}

export interface IMount {
  Target: string;
  Source: string;
  Type: 'bind' | 'volume' | 'tmpfs' | 'npipe';
  ReadOnly: boolean;
  Consistence: string;
  BindOptions: IBindOptions;
  VolumeOptions: IVolumeOptions;
  TmpfsOptions: ITmpfsOptions;
}

export interface IListContainerItem {
  Id: string;
  Names: string[];
  Image: string;
  ImagedID: string;
  Command: string;
  Created: number;
  Ports: IPort[];
  SizeRw: number;
  SizeRootFs: number;
  Labels: Map<string, string>;
  State: string;
  Status: string;
  HostConfig: IHostConfig;
  NetworkSettings: Map<string, INetwork>;
  Mounts: IMount[];
}

export type IGetListContainerResponse = IListContainerItem[];
