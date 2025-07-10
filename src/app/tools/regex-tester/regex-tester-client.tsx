'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToolLayout } from '@/components/tool-layout';
import { 
  Search, 
  Copy, 
  RotateCcw, 
  Info, 
  Code2,
  CheckCircle,
  XCircle,
  Lightbulb,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RegexMatch {
  match: string;
  index: number;
  groups: (string | undefined)[];
  namedGroups?: Record<string, string>;
}

interface RegexFlag {
  flag: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState<RegexFlag[]>([
    { flag: 'g', name: 'Global', description: 'Find all matches', enabled: true },
    { flag: 'i', name: 'Ignore Case', description: 'Case insensitive matching', enabled: false },
    { flag: 'm', name: 'Multiline', description: '^$ match line boundaries', enabled: false },
    { flag: 's', name: 'Dot All', description: '. matches newlines', enabled: false },
    { flag: 'u', name: 'Unicode', description: 'Full Unicode support', enabled: false },
    { flag: 'y', name: 'Sticky', description: 'Match from lastIndex', enabled: false },
  ]);
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [highlightedString, setHighlightedString] = useState('');

  const commonPatterns = [
    {
      name: 'Email Address',
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      description: 'Basic email validation pattern',
      testString: 'Contact us at user@example.com or admin@test.org',
      flags: ['g', 'i']
    },
    {
      name: 'Phone Number (US)',
      pattern: '\\(?(\\d{3})\\)?[-. ]?(\\d{3})[-. ]?(\\d{4})',
      description: 'US phone number with optional formatting',
      testString: 'Call (555) 123-4567 or 555.123.4567 or 5551234567',
      flags: ['g']
    },
    {
      name: 'URL',
      pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
      description: 'HTTP/HTTPS URL pattern',
      testString: 'Visit https://www.example.com or http://test.org/page',
      flags: ['g', 'i']
    },
    {
      name: 'IPv4 Address',
      pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
      description: 'Valid IPv4 address',
      testString: 'Server IPs: 192.168.1.1, 10.0.0.1, 255.255.255.255, 999.999.999.999',
      flags: ['g']
    },
    {
      name: 'Credit Card',
      pattern: '\\b\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}\\b',
      description: 'Credit card number format',
      testString: 'Cards: 1234-5678-9012-3456, 1234 5678 9012 3456, 1234567890123456',
      flags: ['g']
    },
    {
      name: 'Hexadecimal Color',
      pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b',
      description: 'Hex color codes',
      testString: 'Colors: #FF0000, #00ff00, #123, #ABCDEF, #xyz',
      flags: ['g', 'i']
    },
    {
      name: 'Date (MM/DD/YYYY)',
      pattern: '\\b(0?[1-9]|1[0-2])\\/(0?[1-9]|[12]\\d|3[01])\\/(19|20)\\d{2}\\b',
      description: 'US date format',
      testString: 'Dates: 12/25/2023, 1/1/2024, 02/29/2024, 13/40/2023',
      flags: ['g']
    },
    {
      name: 'HTML Tags',
      pattern: '<\\/?(\\w+)(?:\\s[^>]*)?>',
      description: 'HTML opening and closing tags',
      testString: '<div class="test"><p>Hello</p><br/><span>World</span></div>',
      flags: ['g', 'i']
    }
  ];

  const testRegex = useCallback(() => {
    if (!pattern) {
      setMatches([]);
      setIsValid(true);
      setError('');
      setHighlightedString(testString);
      return;
    }

    try {
      const flagsString = flags.filter(f => f.enabled).map(f => f.flag).join('');
      const regex = new RegExp(pattern, flagsString);
      setIsValid(true);
      setError('');

      if (!testString) {
        setMatches([]);
        setHighlightedString('');
        return;
      }

      const foundMatches: RegexMatch[] = [];
      let match;
      let lastIndex = 0;
      let highlighted = '';

      if (flags.find(f => f.flag === 'g')?.enabled) {
        // Global flag - find all matches
        while ((match = regex.exec(testString)) !== null) {
          // Add text before match
          highlighted += testString.slice(lastIndex, match.index);
          
          // Add highlighted match
          highlighted += `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${match[0]}</mark>`;
          
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: Array.from(match.slice(1)),
            namedGroups: match.groups
          });

          lastIndex = match.index + match[0].length;

          // Prevent infinite loop
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
        // Add remaining text
        highlighted += testString.slice(lastIndex);
      } else {
        // Single match
        match = regex.exec(testString);
        if (match) {
          // Add text before match
          highlighted += testString.slice(0, match.index);
          
          // Add highlighted match
          highlighted += `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${match[0]}</mark>`;
          
          // Add text after match
          highlighted += testString.slice(match.index + match[0].length);

          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: Array.from(match.slice(1)),
            namedGroups: match.groups
          });
        } else {
          highlighted = testString;
        }
      }

      setMatches(foundMatches);
      setHighlightedString(highlighted);

    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid regular expression');
      setMatches([]);
      setHighlightedString(testString);
    }
  }, [pattern, testString, flags]);

  useEffect(() => {
    testRegex();
  }, [testRegex]);

  const toggleFlag = (flagToToggle: string) => {
    setFlags(prev => prev.map(flag => 
      flag.flag === flagToToggle 
        ? { ...flag, enabled: !flag.enabled }
        : flag
    ));
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

  const loadPattern = (patternData: typeof commonPatterns[0]) => {
    setPattern(patternData.pattern);
    setTestString(patternData.testString);
    setFlags(prev => prev.map(flag => ({
      ...flag,
      enabled: patternData.flags.includes(flag.flag)
    })));
  };

  const reset = () => {
    setPattern('');
    setTestString('');
    setFlags(prev => prev.map(flag => ({
      ...flag,
      enabled: flag.flag === 'g'
    })));
    setMatches([]);
    setError('');
    setCopied('');
  };

  const getRegexString = () => {
    const flagsString = flags.filter(f => f.enabled).map(f => f.flag).join('');
    return `/${pattern}/${flagsString}`;
  };

  return (
    <ToolLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center">Regex Tester</h1>
            <p className="text-muted-foreground text-center mt-2">
              Test and debug regular expressions with real-time matching and explanations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pattern Input */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    Regular Expression
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-mono">/</span>
                      <Input
                        placeholder="Enter your regex pattern..."
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        className={`font-mono ${!isValid ? 'border-red-500' : ''}`}
                      />
                      <span className="text-lg font-mono">/</span>
                      <span className="text-lg font-mono text-muted-foreground">
                        {flags.filter(f => f.enabled).map(f => f.flag).join('')}
                      </span>
                    </div>
                    
                    {error && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <XCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}
                    
                    {isValid && pattern && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        <span>Valid regular expression</span>
                      </div>
                    )}
                  </div>

                  {/* Flags */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Flags</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {flags.map((flag) => (
                        <label
                          key={flag.flag}
                          className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                            flag.enabled 
                              ? 'bg-primary/10 border-primary' 
                              : 'border-border hover:bg-muted'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={flag.enabled}
                            onChange={() => toggleFlag(flag.flag)}
                            className="rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-mono font-medium">{flag.flag}</div>
                            <div className="text-xs text-muted-foreground">{flag.name}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(getRegexString(), 'regex')}
                      disabled={!pattern}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copied === 'regex' ? 'Copied!' : 'Copy Regex'}
                    </Button>
                    <Button variant="outline" onClick={reset}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowExplanation(!showExplanation)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>

                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-sm border"
                      >
                        <h4 className="font-medium mb-2">Quick Reference:</h4>
                        <div className="grid grid-cols-2 gap-4 text-muted-foreground">
                          <div>
                            <div><code>.</code> - Any character</div>
                            <div><code>*</code> - 0 or more</div>
                            <div><code>+</code> - 1 or more</div>
                            <div><code>?</code> - 0 or 1</div>
                            <div><code>^</code> - Start of string</div>
                            <div><code>$</code> - End of string</div>
                          </div>
                          <div>
                            <div><code>\d</code> - Digit</div>
                            <div><code>\w</code> - Word character</div>
                            <div><code>\s</code> - Whitespace</div>
                            <div><code>[abc]</code> - Character set</div>
                            <div><code>()</code> - Capture group</div>
                            <div><code>|</code> - Alternation</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Test String */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Test String
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter text to test against your regex..."
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />

                  {/* Highlighted Results */}
                  {highlightedString && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm font-medium">Highlighted Matches:</span>
                      </div>
                      <div 
                        className="font-mono text-sm leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: highlightedString }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Matches */}
              {matches.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Matches ({matches.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {matches.map((match, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Match {index + 1}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(match.match, `match-${index}`)}
                            >
                              <Copy className="h-3 w-3" />
                              {copied === `match-${index}` ? 'Copied!' : 'Copy'}
                            </Button>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="text-muted-foreground">Text: </span>
                              <code className="bg-background px-1 rounded">{match.match}</code>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Position: </span>
                              <code className="bg-background px-1 rounded">
                                {match.index}-{match.index + match.match.length}
                              </code>
                            </div>
                            {match.groups.length > 0 && (
                              <div>
                                <span className="text-muted-foreground">Groups: </span>
                                <div className="mt-1 space-y-1">
                                  {match.groups.map((group, groupIndex) => (
                                    <div key={groupIndex} className="ml-4">
                                      <span className="text-muted-foreground">Group {groupIndex + 1}: </span>
                                      <code className="bg-background px-1 rounded">
                                        {group || '(no match)'}
                                      </code>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Common Patterns */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Common Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {commonPatterns.map((patternData, index) => (
                      <button
                        key={index}
                        onClick={() => loadPattern(patternData)}
                        className="w-full p-3 text-left bg-muted hover:bg-accent rounded-lg transition-colors cursor-pointer"
                      >
                        <div className="font-medium text-sm">{patternData.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {patternData.description}
                        </div>
                        <div className="font-mono text-xs bg-background px-2 py-1 rounded mt-2 break-all">
                          /{patternData.pattern}/{patternData.flags.join('')}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">JavaScript Regex:</h4>
                    <p>This tester uses JavaScript&apos;s RegExp engine. Results may vary in other languages.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Common Flags:</h4>
                    <ul className="space-y-1 ml-4">
                      <li>• <strong>g:</strong> Global - find all matches</li>
                      <li>• <strong>i:</strong> Ignore case</li>
                      <li>• <strong>m:</strong> Multiline mode</li>
                      <li>• <strong>s:</strong> Dot matches newlines</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-1">Tips:</h4>
                    <ul className="space-y-1 ml-4">
                      <li>• Use capture groups () to extract parts</li>
                      <li>• Test with various inputs</li>
                      <li>• Escape special characters with \</li>
                      <li>• Use online regex validators for complex patterns</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-1">Privacy:</h4>
                    <p>All regex testing is done locally. No patterns or test strings are sent to external servers.</p>
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
