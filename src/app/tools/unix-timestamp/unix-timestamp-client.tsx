'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToolLayout } from '@/components/tool-layout';
import { 
  Clock, 
  Copy, 
  RotateCcw, 
  Info, 
  Timer,
  Calendar,
  Globe,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimestampInfo {
  timestamp: number;
  iso: string;
  utc: string;
  local: string;
  relative: string;
  date: string;
  time: string;
}

export default function UnixTimestampClient() {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [inputTimestamp, setInputTimestamp] = useState<string>('');
  const [inputDateTime, setInputDateTime] = useState<string>('');
  const [timestampInfo, setTimestampInfo] = useState<TimestampInfo | null>(null);
  const [mode, setMode] = useState<'timestamp-to-date' | 'date-to-timestamp'>('timestamp-to-date');
  const [copied, setCopied] = useState<string>('');
  const [showInfo, setShowInfo] = useState(false);

  // Update current time every second
  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatRelativeTime = useCallback((timestamp: number): string => {
    const now = Date.now();
    const timestampMs = timestamp * 1000;
    const diffMs = now - timestampMs;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (Math.abs(diffSeconds) < 60) {
      return diffSeconds === 0 ? 'now' : `${Math.abs(diffSeconds)} second${Math.abs(diffSeconds) !== 1 ? 's' : ''} ${diffSeconds > 0 ? 'ago' : 'from now'}`;
    } else if (Math.abs(diffMinutes) < 60) {
      return `${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) !== 1 ? 's' : ''} ${diffMinutes > 0 ? 'ago' : 'from now'}`;
    } else if (Math.abs(diffHours) < 24) {
      return `${Math.abs(diffHours)} hour${Math.abs(diffHours) !== 1 ? 's' : ''} ${diffHours > 0 ? 'ago' : 'from now'}`;
    } else if (Math.abs(diffDays) < 7) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ${diffDays > 0 ? 'ago' : 'from now'}`;
    } else if (Math.abs(diffWeeks) < 4) {
      return `${Math.abs(diffWeeks)} week${Math.abs(diffWeeks) !== 1 ? 's' : ''} ${diffWeeks > 0 ? 'ago' : 'from now'}`;
    } else if (Math.abs(diffMonths) < 12) {
      return `${Math.abs(diffMonths)} month${Math.abs(diffMonths) !== 1 ? 's' : ''} ${diffMonths > 0 ? 'ago' : 'from now'}`;
    } else {
      return `${Math.abs(diffYears)} year${Math.abs(diffYears) !== 1 ? 's' : ''} ${diffYears > 0 ? 'ago' : 'from now'}`;
    }
  }, []);

  const convertTimestamp = useCallback((timestamp: number): TimestampInfo => {
    const date = new Date(timestamp * 1000);
    
    return {
      timestamp,
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      relative: formatRelativeTime(timestamp),
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  }, [formatRelativeTime]);

  const handleTimestampInput = useCallback((value: string) => {
    setInputTimestamp(value);
    
    if (value.trim() === '') {
      setTimestampInfo(null);
      return;
    }

    const timestamp = parseInt(value);
    if (!isNaN(timestamp)) {
      // Handle both seconds and milliseconds
      const ts = timestamp.toString().length > 10 ? Math.floor(timestamp / 1000) : timestamp;
      setTimestampInfo(convertTimestamp(ts));
    } else {
      setTimestampInfo(null);
    }
  }, [convertTimestamp]);

  const handleDateTimeInput = useCallback((value: string) => {
    setInputDateTime(value);
    
    if (value.trim() === '') {
      setTimestampInfo(null);
      return;
    }

    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      const timestamp = Math.floor(date.getTime() / 1000);
      setTimestampInfo(convertTimestamp(timestamp));
    } else {
      setTimestampInfo(null);
    }
  }, [convertTimestamp]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const useCurrentTimestamp = () => {
    const timestamp = currentTime.toString();
    setInputTimestamp(timestamp);
    handleTimestampInput(timestamp);
    setMode('timestamp-to-date');
  };

  const useCurrentDateTime = () => {
    const now = new Date();
    const dateTimeString = now.toISOString().slice(0, 16); // Format for datetime-local input
    setInputDateTime(dateTimeString);
    handleDateTimeInput(dateTimeString);
    setMode('date-to-timestamp');
  };

  const reset = () => {
    setInputTimestamp('');
    setInputDateTime('');
    setTimestampInfo(null);
    setCopied('');
  };

  const predefinedTimestamps = [
    { label: 'Unix Epoch', timestamp: 0 },
    { label: 'Y2K', timestamp: 946684800 },
    { label: '9/11/2001', timestamp: 1000166400 },
    { label: 'iPhone Launch', timestamp: 1183161600 },
    { label: 'Bitcoin Genesis', timestamp: 1231006505 },
    { label: 'COVID-19 WHO Declaration', timestamp: 1583971200 },
  ];

  return (
    <ToolLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center">Unix Timestamp Converter</h1>
            <p className="text-muted-foreground text-center mt-2">
              Convert between Unix timestamps and human-readable dates
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Time */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Current Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Unix Timestamp:</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(currentTime.toString(), 'timestamp')}
                        >
                          <Copy className="h-3 w-3" />
                          {copied === 'timestamp' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <div className="text-2xl font-mono bg-muted p-3 rounded">{currentTime}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Local Time:</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(new Date().toLocaleString(), 'local-time')}
                        >
                          <Copy className="h-3 w-3" />
                          {copied === 'local-time' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <div className="text-lg font-mono bg-muted p-3 rounded">
                        {new Date().toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Converter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Converter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mode Toggle */}
                <div className="flex gap-2">
                  <Button
                    variant={mode === 'timestamp-to-date' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('timestamp-to-date')}
                    className="flex-1"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Timestamp → Date
                  </Button>
                  <Button
                    variant={mode === 'date-to-timestamp' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('date-to-timestamp')}
                    className="flex-1"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Date → Timestamp
                  </Button>
                </div>

                {/* Input */}
                {mode === 'timestamp-to-date' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Unix Timestamp</label>
                    <Input
                      type="number"
                      placeholder="Enter Unix timestamp (seconds or milliseconds)"
                      value={inputTimestamp}
                      onChange={(e) => handleTimestampInput(e.target.value)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={useCurrentTimestamp}
                      className="w-full"
                    >
                      <Timer className="h-4 w-4 mr-2" />
                      Use Current Timestamp
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date & Time</label>
                    <Input
                      type="datetime-local"
                      value={inputDateTime}
                      onChange={(e) => handleDateTimeInput(e.target.value)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={useCurrentDateTime}
                      className="w-full"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Use Current Date
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={reset}
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowInfo(!showInfo)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>

                <AnimatePresence>
                  {showInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-sm border"
                    >
                      <h4 className="font-medium mb-2">About Unix Timestamps:</h4>
                      <p className="text-muted-foreground mb-2">
                        Unix timestamps represent the number of seconds since January 1, 1970, 00:00:00 UTC (Unix Epoch).
                      </p>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Used in programming, databases, and APIs</li>
                        <li>• Timezone-independent representation</li>
                        <li>• Supports both seconds and milliseconds</li>
                        <li>• 32-bit limit: January 19, 2038</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Conversion Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                {timestampInfo ? (
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      {/* Timestamp */}
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="text-sm font-medium">Unix Timestamp</div>
                          <div className="font-mono text-sm">{timestampInfo.timestamp}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(timestampInfo.timestamp.toString(), 'result-timestamp')}
                        >
                          <Copy className="h-3 w-3" />
                          {copied === 'result-timestamp' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>

                      {/* ISO 8601 */}
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="text-sm font-medium">ISO 8601</div>
                          <div className="font-mono text-sm">{timestampInfo.iso}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(timestampInfo.iso, 'result-iso')}
                        >
                          <Copy className="h-3 w-3" />
                          {copied === 'result-iso' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>

                      {/* UTC */}
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="text-sm font-medium">UTC</div>
                          <div className="font-mono text-sm">{timestampInfo.utc}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(timestampInfo.utc, 'result-utc')}
                        >
                          <Copy className="h-3 w-3" />
                          {copied === 'result-utc' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>

                      {/* Local Time */}
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="text-sm font-medium">Local Time</div>
                          <div className="font-mono text-sm">{timestampInfo.local}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(timestampInfo.local, 'result-local')}
                        >
                          <Copy className="h-3 w-3" />
                          {copied === 'result-local' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>

                      {/* Relative Time */}
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border">
                        <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Relative Time</div>
                        <div className="text-blue-800 dark:text-blue-200 font-medium">{timestampInfo.relative}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Enter a timestamp or date to see the conversion</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Predefined Timestamps */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Historical Timestamps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {predefinedTimestamps.map((item) => (
                      <button
                        key={item.timestamp}
                        onClick={() => {
                          setInputTimestamp(item.timestamp.toString());
                          handleTimestampInput(item.timestamp.toString());
                          setMode('timestamp-to-date');
                        }}
                        className="p-3 text-left bg-muted hover:bg-accent rounded-lg transition-colors cursor-pointer"
                      >
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="font-mono text-xs text-muted-foreground">{item.timestamp}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(item.timestamp * 1000).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    About Unix Timestamps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">What is Unix Time?</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Unix time is the number of seconds since January 1, 1970, 00:00:00 UTC. 
                        It&apos;s widely used in programming and computer systems.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Language-independent time representation</li>
                        <li>• No timezone or daylight saving confusion</li>
                        <li>• Easy to perform calculations</li>
                        <li>• Standard across Unix-like systems</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Common Use Cases</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Database timestamps</li>
                        <li>• API date/time parameters</li>
                        <li>• Log file analysis</li>
                        <li>• Event scheduling systems</li>
                        <li>• Cross-timezone applications</li>
                        <li>• File system timestamps</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                      Year 2038 Problem
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      32-bit Unix timestamps will overflow on January 19, 2038, at 03:14:07 UTC. 
                      Modern systems use 64-bit timestamps to avoid this issue.
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
