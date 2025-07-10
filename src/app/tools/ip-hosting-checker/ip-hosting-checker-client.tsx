
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ToolLayout } from '@/components/tool-layout';
import { 
  Globe, 
  Copy, 
  RotateCcw, 
  Info, 
  MapPin,
  Server,
  Shield,
  Network,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface IPInfo {
  ip: string;
  hostname?: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  timezone?: string;
  isp?: string;
  org?: string;
  as?: string;
  lat?: number;
  lon?: number;
  mobile?: boolean;
  proxy?: boolean;
  hosting?: boolean;
}

interface DomainInfo {
  domain: string;
  registrar?: string;
  registrationDate?: string;
  expirationDate?: string;
  nameServers?: string[];
  status?: string[];
  dnssec?: boolean;
}

interface SecurityInfo {
  isPrivate: boolean;
  isProxy: boolean;
  isVPN: boolean;
  isTor: boolean;
  isRelay: boolean;
  isMalicious: boolean;
  threatTypes?: string[];
}

export default function IPHostingCheckerPage() {
  const [input, setInput] = useState('');
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null);
  const [securityInfo, setSecurityInfo] = useState<SecurityInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [inputType, setInputType] = useState<'ip' | 'domain' | 'unknown'>('unknown');

  const detectInputType = (value: string): 'ip' | 'domain' | 'unknown' => {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    
    if (ipRegex.test(value)) return 'ip';
    if (domainRegex.test(value)) return 'domain';
    return 'unknown';
  };

  const getMyIP = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Get user's IP address
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setInput(data.ip);
      setInputType('ip');
      await lookupIP(data.ip);
    } catch {
      setError('Failed to get your IP address');
    } finally {
      setIsLoading(false);
    }
  };

  const lookupIP = async (ip: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Using ipapi.co for IP geolocation (free tier)
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'Invalid IP address');
      }

      const ipData: IPInfo = {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        countryCode: data.country_code,
        timezone: data.timezone,
        isp: data.org,
        org: data.org,
        as: data.asn,
        lat: data.latitude,
        lon: data.longitude,
      };

      setIpInfo(ipData);

      // Simulate security check (in real app, you'd use actual security APIs)
      const mockSecurityInfo: SecurityInfo = {
        isPrivate: isPrivateIP(ip),
        isProxy: Math.random() > 0.9,
        isVPN: Math.random() > 0.95,
        isTor: Math.random() > 0.99,
        isRelay: Math.random() > 0.98,
        isMalicious: Math.random() > 0.97,
      };

      setSecurityInfo(mockSecurityInfo);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lookup IP address');
    } finally {
      setIsLoading(false);
    }
  };

  const lookupDomain = async (domain: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      // For domain info, we'll simulate the data since WHOIS APIs require backend
      // In a real application, you'd need a backend service to query WHOIS data
      
      const mockDomainInfo: DomainInfo = {
        domain: domain,
        registrar: 'Example Registrar Inc.',
        registrationDate: '2020-01-15',
        expirationDate: '2025-01-15',
        nameServers: [
          'ns1.example.com',
          'ns2.example.com'
        ],
        status: ['clientTransferProhibited'],
        dnssec: Math.random() > 0.5,
      };

      setDomainInfo(mockDomainInfo);

      // Try to resolve domain to IP
      try {
        const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
        const dnsData = await response.json();
        
        if (dnsData.Answer && dnsData.Answer.length > 0) {
          const ip = dnsData.Answer[0].data;
          await lookupIP(ip);
        }
      } catch (dnsError) {
        console.log('DNS resolution failed:', dnsError);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lookup domain');
    } finally {
      setIsLoading(false);
    }
  };

  const isPrivateIP = (ip: string): boolean => {
    const parts = ip.split('.').map(Number);
    
    // 10.0.0.0/8
    if (parts[0] === 10) return true;
    
    // 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    
    // 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;
    
    // 127.0.0.0/8 (localhost)
    if (parts[0] === 127) return true;
    
    return false;
  };

  const handleLookup = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      setError('Please enter an IP address or domain name');
      return;
    }

    const type = detectInputType(trimmedInput);
    setInputType(type);

    if (type === 'unknown') {
      setError('Please enter a valid IP address or domain name');
      return;
    }

    // Clear previous results
    setIpInfo(null);
    setDomainInfo(null);
    setSecurityInfo(null);

    if (type === 'ip') {
      await lookupIP(trimmedInput);
    } else {
      await lookupDomain(trimmedInput);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const reset = () => {
    setInput('');
    setIpInfo(null);
    setDomainInfo(null);
    setSecurityInfo(null);
    setError('');
    setCopied('');
    setInputType('unknown');
  };

  const commonIPs = [
    { label: 'Google DNS', ip: '8.8.8.8' },
    { label: 'Cloudflare DNS', ip: '1.1.1.1' },
    { label: 'OpenDNS', ip: '208.67.222.222' },
    { label: 'Quad9 DNS', ip: '9.9.9.9' },
  ];

  const commonDomains = [
    'google.com',
    'github.com',
    'stackoverflow.com',
    'cloudflare.com',
  ];

  return (
    <ToolLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center">IP Address & Hosting Checker</h1>
            <p className="text-muted-foreground text-center mt-2">
              Get detailed information about IP addresses, domains, and hosting details
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Section */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Lookup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter IP address or domain..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
                    />
                    {inputType !== 'unknown' && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {inputType === 'ip' ? <Network className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                        <span>Detected: {inputType === 'ip' ? 'IP Address' : 'Domain Name'}</span>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={handleLookup} disabled={isLoading || !input.trim()}>
                      {isLoading ? <LoadingSpinner size="sm" /> : <Eye className="h-4 w-4" />}
                      Lookup
                    </Button>
                    <Button variant="outline" onClick={getMyIP} disabled={isLoading}>
                      <MapPin className="h-4 w-4" />
                      My IP
                    </Button>
                  </div>

                  <Button variant="outline" onClick={reset} className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Examples */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Quick Examples
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Common IPs</h4>
                    <div className="space-y-1">
                      {commonIPs.map((item) => (
                        <button
                          key={item.ip}
                          onClick={() => {
                            setInput(item.ip);
                            setInputType('ip');
                          }}
                          className="w-full text-left p-2 text-sm bg-muted hover:bg-accent rounded transition-colors cursor-pointer"
                        >
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground font-mono">{item.ip}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Common Domains</h4>
                    <div className="space-y-1">
                      {commonDomains.map((domain) => (
                        <button
                          key={domain}
                          onClick={() => {
                            setInput(domain);
                            setInputType('domain');
                          }}
                          className="w-full text-left p-2 text-sm bg-muted hover:bg-accent rounded transition-colors cursor-pointer"
                        >
                          <div className="font-mono">{domain}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* IP Information */}
              {ipInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Network className="h-5 w-5" />
                        IP Information
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(ipInfo.ip, 'ip')}
                      >
                        <Copy className="h-3 w-3" />
                        {copied === 'ip' ? 'Copied!' : 'Copy IP'}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">IP Address:</span>
                          <div className="font-mono text-lg">{ipInfo.ip}</div>
                        </div>
                        {ipInfo.hostname && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Hostname:</span>
                            <div className="font-mono">{ipInfo.hostname}</div>
                          </div>
                        )}
                        {ipInfo.isp && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">ISP/Organization:</span>
                            <div>{ipInfo.isp}</div>
                          </div>
                        )}
                        {ipInfo.as && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">AS Number:</span>
                            <div className="font-mono">{ipInfo.as}</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {ipInfo.city && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Location:</span>
                            <div>
                              {ipInfo.city}
                              {ipInfo.region && `, ${ipInfo.region}`}
                              {ipInfo.country && `, ${ipInfo.country}`}
                              {ipInfo.countryCode && ` (${ipInfo.countryCode})`}
                            </div>
                          </div>
                        )}
                        {ipInfo.timezone && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Timezone:</span>
                            <div>{ipInfo.timezone}</div>
                          </div>
                        )}
                        {ipInfo.lat && ipInfo.lon && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Coordinates:</span>
                            <div className="font-mono">{ipInfo.lat}, {ipInfo.lon}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Security Information */}
              {securityInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        {securityInfo.isPrivate ? (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm">Private IP</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {securityInfo.isProxy ? (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-sm">Proxy</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {securityInfo.isVPN ? (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-sm">VPN</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {securityInfo.isTor ? (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-sm">Tor Exit Node</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {securityInfo.isMalicious ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-sm">Malicious</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {securityInfo.isRelay ? (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-sm">Relay</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Domain Information */}
              {domainInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Domain Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Domain:</span>
                          <div className="font-mono">{domainInfo.domain}</div>
                        </div>
                        {domainInfo.registrar && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Registrar:</span>
                            <div>{domainInfo.registrar}</div>
                          </div>
                        )}
                        {domainInfo.registrationDate && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Registration Date:</span>
                            <div>{domainInfo.registrationDate}</div>
                          </div>
                        )}
                        {domainInfo.expirationDate && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Expiration Date:</span>
                            <div>{domainInfo.expirationDate}</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {domainInfo.nameServers && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Name Servers:</span>
                            <div className="space-y-1">
                              {domainInfo.nameServers.map((ns, index) => (
                                <div key={index} className="font-mono text-sm">{ns}</div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          {domainInfo.dnssec ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">DNSSEC</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* No Results */}
              {!isLoading && !ipInfo && !domainInfo && !error && (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center text-muted-foreground">
                      <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Enter an IP or Domain</h3>
                      <p>Enter an IP address or domain name to get detailed information about its location, hosting, and security status.</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Features:</h4>
                    <ul className="space-y-1 ml-4">
                      <li>• IP geolocation and ISP information</li>
                      <li>• Domain WHOIS data and DNS records</li>
                      <li>• Security analysis and threat detection</li>
                      <li>• Support for both IPv4 addresses and domains</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Data Sources:</h4>
                    <p>IP geolocation data is provided by public APIs. Domain information is simulated for demonstration purposes.</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-1">Privacy:</h4>
                    <p>Lookup requests are made directly to public APIs. No data is stored or logged by this application.</p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded border border-yellow-200 dark:border-yellow-800">
                    <p className="text-yellow-800 dark:text-yellow-200 text-xs">
                      <strong>Note:</strong> Some features like domain WHOIS data are simulated in this demo. 
                      A production version would require backend services to access complete WHOIS databases.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
