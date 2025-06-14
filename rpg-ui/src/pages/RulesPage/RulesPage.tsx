import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card/Card';
import { Badge } from '@/components/Badge/Badge';
import { Button } from '@/components/Button/Button';
import { SectionTitle } from '@/components/SectionTitle/SectionTitle';
import { BookOpen, Users, Heart, Zap, Shield, Dice1 } from 'lucide-react';

export function RulesPage() {
  const tableOfContents = [
    { id: 'introduction', title: 'Introduction', level: 1 },
    { id: 'what-you-need', title: 'What You Need', level: 1 },
    { id: 'character-creation', title: 'Character Creation', level: 1 },
    { id: 'core-mechanics', title: 'Core Mechanics', level: 1 },
    { id: 'health-damage', title: 'Health and Damage', level: 1 },
    { id: 'luck-points', title: 'Luck Points', level: 1 },
    { id: 'combat', title: 'Combat', level: 1 },
    { id: 'magic', title: 'Magic and Special Abilities', level: 1 },
    { id: 'gamemaster', title: "Gamemaster's Section", level: 1 },
    { id: 'optional-rules', title: 'Optional Rules', level: 1 },
    { id: 'quick-reference', title: 'Quick Reference', level: 1 },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-full bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-card to-background border-b border-border py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <Dice1 className="h-12 w-12 text-accent mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Simple D6 Rules
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            A minimalist tabletop roleplaying game for storytellers
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            Character-driven • Story-first • Quick to learn • Universal
          </p>
          <Button 
            variant="accent" 
            leftIcon={BookOpen}
            onClick={() => scrollToSection('quick-reference')}
          >
            Jump to Quick Reference
          </Button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card variant="elevated" className="p-0">
                <CardHeader className="px-6 py-4 border-b border-border">
                  <h2 className="font-semibold text-lg">Table of Contents</h2>
                </CardHeader>
                <nav className="p-4">
                  <ul className="space-y-2">
                    {tableOfContents.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors block w-full py-1"
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Introduction */}
            <section id="introduction">
              <SectionTitle level={1}>Introduction</SectionTitle>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                  The RPG Playbook Narrative System is designed around one core principle: <strong>you are your character</strong>.
                </p>
                <p className="text-muted-foreground mb-6">
                  There are no complex skill trees, attribute scores, or character builds. Instead, your character's 
                  capabilities come naturally from who they are and what they do.
                </p>
                <p className="text-muted-foreground mb-8">
                  If you're playing a doctor, you understand medicine. If you're a knight, you know combat and honor. 
                  If you're a detective, you can investigate crimes. The game gets out of the way and lets you tell amazing stories together.
                </p>
                
                <Card variant="feature" className="bg-accent/5 border border-accent/20">
                  <CardHeader>
                    <h3 className="text-xl font-semibold mb-4">Design Philosophy</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-accent" />
                        <span><strong>Character-driven:</strong> Your background defines your abilities</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-accent" />
                        <span><strong>Story-first:</strong> Rules support narrative</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-accent" />
                        <span><strong>Quick to learn:</strong> Five minutes to understand</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Dice1 className="h-5 w-5 text-accent" />
                        <span><strong>Universal:</strong> Works for any genre or setting</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* What You Need */}
            <section id="what-you-need">
              <SectionTitle level={1}>What You Need</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="elevated">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">For Each Player</h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• One six-sided die (D6)</li>
                      <li>• Paper and pencil</li>
                      <li>• Character sheet (or just a notecard)</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card variant="elevated">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">For the Group</h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• 2-6 players (including one Gamemaster)</li>
                      <li>• About 2-4 hours per session</li>
                      <li>• Your collective imagination</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Character Creation */}
            <section id="character-creation">
              <SectionTitle level={1}>Character Creation</SectionTitle>
              
              <div className="space-y-6">
                <Card variant="default">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Step 1: Concept</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Decide who your character is. Consider:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
                      <div>
                        <strong>Profession:</strong> What do they do for a living?<br/>
                        <strong>Background:</strong> Where do they come from?
                      </div>
                      <div>
                        <strong>Personality:</strong> What drives them?<br/>
                        <strong>Goals:</strong> What do they want?
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="default">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Step 2: Write It Down</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Record the following on your character sheet:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
                      <div>
                        <strong>Name:</strong> What are they called?<br/>
                        <strong>Description:</strong> A few sentences about appearance and personality
                      </div>
                      <div>
                        <strong>Health Points:</strong> 3 (everyone starts here)<br/>
                        <strong>Luck Points:</strong> 2 (refreshed each adventure)<br/>
                        <strong>Background:</strong> Your character's profession, training, or life experience
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="default">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Step 3: Establish Relationships</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Briefly discuss how your character knows the other player characters. 
                      These connections will drive the story forward.
                    </p>
                  </CardContent>
                </Card>

                {/* Character Examples */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Character Examples</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card variant="ghost" className="border border-border">
                      <CardHeader>
                        <h4 className="font-semibold">Dr. Sarah Chen</h4>
                        <p className="text-sm text-muted-foreground">Emergency room physician with steady hands and a caring heart</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="green" size="sm">Health: 3</Badge>
                          <Badge variant="cyan" size="sm">Luck: 2</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Background grants expertise in medicine, staying calm under pressure, and understanding human nature
                        </p>
                      </CardContent>
                    </Card>

                    <Card variant="ghost" className="border border-border">
                      <CardHeader>
                        <h4 className="font-semibold">Sir Marcus Brightblade</h4>
                        <p className="text-sm text-muted-foreground">Young knight seeking to prove his honor</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="green" size="sm">Health: 3</Badge>
                          <Badge variant="cyan" size="sm">Luck: 2</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Background grants expertise in combat, military tactics, and chivalric codes
                        </p>
                      </CardContent>
                    </Card>

                    <Card variant="ghost" className="border border-border">
                      <CardHeader>
                        <h4 className="font-semibold">"Whisper" Delacroix</h4>
                        <p className="text-sm text-muted-foreground">Street-smart thief with quick fingers and quicker wit</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="green" size="sm">Health: 3</Badge>
                          <Badge variant="cyan" size="sm">Luck: 2</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Background grants expertise in stealth, lockpicking, and urban survival
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Mechanics */}
            <section id="core-mechanics">
              <SectionTitle level={1}>Core Mechanics</SectionTitle>
              
              <div className="space-y-6">
                <Card variant="feature" className="bg-accent/5 border border-accent/20">
                  <CardHeader>
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Dice1 className="h-6 w-6" />
                      The Basic Roll
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      When you attempt something with an uncertain outcome, the Gamemaster (GM) calls for a check. 
                      Roll one six-sided die:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="text-2xl font-bold text-red-700 dark:text-red-300">1-2</div>
                        <div className="text-sm font-medium text-red-600 dark:text-red-400">Failure</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">3-4</div>
                        <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Partial Success</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">5-6</div>
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">Full Success</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card variant="default">
                    <CardHeader>
                      <h3 className="text-xl font-semibold">Difficulty Modifiers</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">The GM may modify your roll based on circumstances:</p>
                      <ul className="space-y-2 text-muted-foreground">
                        <li><strong>Favorable conditions:</strong> +1 to roll</li>
                        <li><strong>Challenging conditions:</strong> -1 to roll</li>
                        <li><strong>Extreme conditions:</strong> -2 to roll</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card variant="default">
                    <CardHeader>
                      <h3 className="text-xl font-semibold">Character Expertise</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        When attempting something directly related to your character's background, <strong>add +1 to your roll</strong>.
                      </p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>• Doctor performing medical procedures</p>
                        <p>• Soldier using military knowledge</p>
                        <p>• Scholar recalling historical facts</p>
                        <p>• Criminal picking locks or sneaking</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card variant="ghost" className="border border-border">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Interpreting Results</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <strong className="text-red-600 dark:text-red-400">Failure (1-2):</strong>
                        <span className="text-muted-foreground ml-2">
                          Something goes wrong. The GM describes the consequences and how the story moves forward.
                        </span>
                      </div>
                      <div>
                        <strong className="text-yellow-600 dark:text-yellow-400">Partial Success (3-4):</strong>
                        <span className="text-muted-foreground ml-2">
                          You achieve your goal, but there's a complication, cost, or consequence. This is often the most interesting result.
                        </span>
                      </div>
                      <div>
                        <strong className="text-green-600 dark:text-green-400">Full Success (5-6):</strong>
                        <span className="text-muted-foreground ml-2">
                          You accomplish exactly what you intended without significant problems.
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Health and Damage */}
            <section id="health-damage">
              <SectionTitle level={1} icon={Heart}>Health and Damage</SectionTitle>
              
              <div className="space-y-6">
                <Card variant="default">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Health Points</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Every character begins with 3 Health Points:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="green">3 HP</Badge>
                          <span className="text-muted-foreground">Healthy and uninjured</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="yellow">2 HP</Badge>
                          <span className="text-muted-foreground">Wounded (minor injuries, describe them narratively)</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="destructive">1 HP</Badge>
                          <span className="text-muted-foreground">Badly Hurt (serious injuries, -1 to all rolls)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-red-500 text-red-500">0 HP</Badge>
                          <span className="text-muted-foreground">Unconscious or dead (GM's discretion)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card variant="default">
                    <CardHeader>
                      <h3 className="text-xl font-semibold">Taking Damage</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">Damage depends on the severity of harm:</p>
                      <div className="space-y-2">
                        <div><strong>Minor harm:</strong> 1 damage <span className="text-sm text-muted-foreground">(punch, small cut, minor fall)</span></div>
                        <div><strong>Serious harm:</strong> 2 damage <span className="text-sm text-muted-foreground">(sword wound, significant fall, explosion nearby)</span></div>
                        <div><strong>Massive harm:</strong> 3 damage <span className="text-sm text-muted-foreground">(point-blank gunshot, dragon bite, falling off cliff)</span></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card variant="default">
                    <CardHeader>
                      <h3 className="text-xl font-semibold">Healing</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div><strong>Natural Recovery:</strong> <span className="text-muted-foreground">Regain 1 HP after a full night's rest in safety</span></div>
                        <div><strong>Medical Treatment:</strong> <span className="text-muted-foreground">Proper medical care can restore 1 HP immediately (once per injury)</span></div>
                        <div><strong>Magical Healing:</strong> <span className="text-muted-foreground">As appropriate to your setting and story</span></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Luck Points */}
            <section id="luck-points">
              <SectionTitle level={1} icon={Zap}>Luck Points</SectionTitle>
              
              <div className="space-y-6">
                <Card variant="feature" className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                  <CardContent>
                    <p className="text-lg">
                      Every character starts each adventure with <strong>2 Luck Points</strong>. 
                      These represent heroic determination, divine favor, or simple good fortune.
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card variant="default">
                    <CardHeader>
                      <h3 className="text-xl font-semibold">Spending Luck</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">Spend 1 Luck Point to:</p>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• <strong>Auto-succeed</strong> on any roll (declare before rolling)</li>
                        <li>• <strong>Avoid damage</strong> (negate 1 point of incoming damage)</li>
                        <li>• <strong>Declare a coincidence</strong> (add a helpful detail to the scene)</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card variant="default" className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-red-700 dark:text-red-300">Luck is Precious</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-red-600 dark:text-red-400">
                        Once spent, Luck Points are gone for the entire adventure. Choose wisely when to use them.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card variant="ghost" className="border border-border">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Examples of Luck Use</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <strong>Auto-Success:</strong> 
                        <span className="text-muted-foreground ml-2">"I spend a Luck Point to perfectly pick this lock."</span>
                      </div>
                      <div>
                        <strong>Avoid Damage:</strong> 
                        <span className="text-muted-foreground ml-2">"I spend Luck to dive behind cover just as the explosion goes off."</span>
                      </div>
                      <div>
                        <strong>Declare Coincidence:</strong> 
                        <span className="text-muted-foreground ml-2">"I spend Luck to declare there's a rope hanging down this cliff face."</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Combat */}
            <section id="combat">
              <SectionTitle level={1} icon={Shield}>Combat</SectionTitle>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card variant="default">
                    <CardHeader>
                      <h3 className="text-xl font-semibold">Making Attacks</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">Roll 1D6 to attack:</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">1-2:</span>
                          <span className="text-muted-foreground">Miss completely</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">3-4:</span>
                          <span className="text-muted-foreground">Hit for 1 damage</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">5-6:</span>
                          <span className="text-muted-foreground">Hit for 2 damage</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card variant="default">
                    <CardHeader>
                      <h3 className="text-xl font-semibold">Initiative and Timing</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">Combat proceeds in whatever order makes narrative sense. If timing matters:</p>
                      <div className="space-y-2">
                        <div><strong>Act first:</strong> <span className="text-muted-foreground">+1 to your roll (surprise, quick reflexes)</span></div>
                        <div><strong>Act defensively:</strong> <span className="text-muted-foreground">+1 to avoid damage</span></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card variant="default">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Combat Modifiers</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Favorable Conditions (+1):</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Superior weapon or position</li>
                          <li>• Character expertise (soldier, duelist, etc.)</li>
                          <li>• Outnumbering opponent</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Unfavorable Conditions (-1):</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Poor weapon or awkward position</li>
                          <li>• Fighting while injured</li>
                          <li>• Opponent has significant advantage</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="default">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Armor and Protection</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <strong>Light Protection:</strong> <span className="text-muted-foreground">Reduce incoming damage by 1 (minimum 0)</span>
                        <div className="text-sm text-muted-foreground mt-1">Leather armor, thick clothing, motorcycle helmet</div>
                      </div>
                      <div>
                        <strong>Heavy Protection:</strong> <span className="text-muted-foreground">Reduce incoming damage by 2 (minimum 0)</span>
                        <div className="text-sm text-muted-foreground mt-1">Plate mail, riot gear, bulletproof vest</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Magic and Special Abilities */}
            <section id="magic">
              <SectionTitle level={1} icon={Zap} className="text-purple-500">Magic and Special Abilities</SectionTitle>
              
              <div className="space-y-6">
                <Card variant="feature" className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Magic System</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Magic and supernatural abilities use the same basic roll system:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div><strong className="text-green-600 dark:text-green-400">Easy Magic (+1):</strong> <span className="text-muted-foreground">Simple cantrips, basic supernatural senses</span></div>
                        <div><strong>Normal Magic (0):</strong> <span className="text-muted-foreground">Standard spells appropriate to your character</span></div>
                      </div>
                      <div className="space-y-2">
                        <div><strong className="text-yellow-600 dark:text-yellow-400">Hard Magic (-1):</strong> <span className="text-muted-foreground">Powerful or complex magical effects</span></div>
                        <div><strong className="text-red-600 dark:text-red-400">Epic Magic (-2):</strong> <span className="text-muted-foreground">Legendary feats of supernatural power</span></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="default">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Consequences of Magic</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <strong className="text-red-600 dark:text-red-400">Failure:</strong>
                        <span className="text-muted-foreground ml-2">Magic can backfire, attract unwanted attention, or drain the caster</span>
                      </div>
                      <div>
                        <strong className="text-yellow-600 dark:text-yellow-400">Partial Success:</strong>
                        <span className="text-muted-foreground ml-2">The spell works but with unexpected side effects or limitations</span>
                      </div>
                      <div>
                        <strong className="text-green-600 dark:text-green-400">Success:</strong>
                        <span className="text-muted-foreground ml-2">The magic functions as intended</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="ghost" className="border border-border">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Supernatural Characters</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      If playing vampires, wizards, or other supernatural beings, their special abilities work through 
                      character expertise and the normal roll system.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Gamemaster's Section */}
            <section id="gamemaster">
              <SectionTitle level={1}>Gamemaster's Section</SectionTitle>
              
              <div className="space-y-6">
                <Card variant="feature" className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">The GM's Role</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">As Gamemaster, you:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Describe the world and bring NPCs to life</li>
                        <li>• Call for rolls when outcomes are uncertain</li>
                      </ul>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Interpret results and drive the story forward</li>
                        <li>• Keep the focus on character and narrative</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card variant="default">
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">When to Call for Rolls</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3">Do call for rolls when:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• The outcome is uncertain</li>
                        <li>• Failure would be interesting</li>
                        <li>• Success isn't guaranteed</li>
                        <li>• Time pressure or stress affects the situation</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card variant="default">
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">When NOT to Call for Rolls</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3">Don't call for rolls when:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• The character should easily succeed</li>
                        <li>• Failure would just stop the story</li>
                        <li>• You want to showcase character competence</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card variant="default">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Setting Difficulty</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <strong>No Modifier (Standard):</strong> 
                        <span className="text-muted-foreground ml-2">Most tasks fall here. The character has a reasonable chance of success.</span>
                      </div>
                      <div>
                        <strong className="text-green-600 dark:text-green-400">Easy (+1):</strong>
                        <div className="text-sm text-muted-foreground mt-1 ml-4">
                          • Ideal conditions (proper tools, plenty of time)<br/>
                          • Playing to character strengths<br/>
                          • Simple tasks under pressure
                        </div>
                      </div>
                      <div>
                        <strong className="text-yellow-600 dark:text-yellow-400">Hard (-1):</strong>
                        <div className="text-sm text-muted-foreground mt-1 ml-4">
                          • Poor conditions (bad weather, improvised tools)<br/>
                          • Time pressure or stress<br/>
                          • Outside character's normal expertise
                        </div>
                      </div>
                      <div>
                        <strong className="text-red-600 dark:text-red-400">Very Hard (-2):</strong>
                        <div className="text-sm text-muted-foreground mt-1 ml-4">
                          • Extreme conditions (combat, disaster)<br/>
                          • Severely improvised or damaged equipment<br/>
                          • Attempting something far beyond normal capability
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="ghost" className="border border-border bg-yellow-50 dark:bg-yellow-950">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Partial Success Guidelines</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Partial success (rolling 3-4) is often the most interesting result. Consider:
                    </p>
                    <div className="space-y-3">
                      <div>
                        <strong>"Yes, but..."</strong> - They succeed with a complication
                        <div className="text-sm text-muted-foreground italic mt-1">
                          "You pick the lock, but it takes longer than expected and you hear footsteps approaching"
                        </div>
                      </div>
                      <div>
                        <strong>"You succeed, however..."</strong> - Success with a cost
                        <div className="text-sm text-muted-foreground italic mt-1">
                          "You hack the computer, but trigger an alarm in the process"
                        </div>
                      </div>
                      <div>
                        <strong>Progress toward goal</strong> - Partial advancement
                        <div className="text-sm text-muted-foreground italic mt-1">
                          "You don't convince the guard to let you pass, but he's now interested in hearing more"
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Optional Rules */}
            <section id="optional-rules">
              <SectionTitle level={1}>Optional Rules</SectionTitle>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card variant="default">
                    <CardHeader>
                      <h3 className="text-xl font-semibold">Extended Conflicts</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3">For complex situations requiring multiple successes:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Set a target (usually 3-5 successes)</li>
                        <li>• Track progress as characters attempt different approaches</li>
                        <li>• Add complications with partial successes</li>
                        <li>• Increase tension as time runs out</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card variant="default">
                    <CardHeader>
                      <h3 className="text-xl font-semibold">Equipment and Resources</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div><strong className="text-green-600 dark:text-green-400">Quality Equipment:</strong> <span className="text-muted-foreground">+1 to relevant rolls</span></div>
                        <div><strong className="text-yellow-600 dark:text-yellow-400">Improvised Tools:</strong> <span className="text-muted-foreground">-1 to relevant rolls</span></div>
                        <div><strong className="text-red-600 dark:text-red-400">Broken Equipment:</strong> <span className="text-muted-foreground">-2 or impossible</span></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card variant="default">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Advancement</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">For longer campaigns, consider these simple advancement options:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <strong>New Backgrounds:</strong>
                        <div className="text-sm text-muted-foreground">Characters can gain additional areas of expertise</div>
                      </div>
                      <div>
                        <strong>Improved Health:</strong>
                        <div className="text-sm text-muted-foreground">Maximum health increases to 4, then 5</div>
                      </div>
                      <div>
                        <strong>Extra Luck:</strong>
                        <div className="text-sm text-muted-foreground">Start adventures with 3 Luck Points instead of 2</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="default">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Sanity and Mental Health</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">For horror games, treat mental trauma like physical damage:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• 3 Sanity Points starting value</li>
                        <li>• Mental damage from horrific events</li>
                      </ul>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Breakdown at 0 Sanity</li>
                        <li>• Recovery through rest and therapy</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Quick Reference */}
            <section id="quick-reference">
              <SectionTitle level={1}>Quick Reference</SectionTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card variant="elevated">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Basic Roll</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>1-2:</span>
                        <span className="text-red-600 dark:text-red-400">Failure</span>
                      </div>
                      <div className="flex justify-between">
                        <span>3-4:</span>
                        <span className="text-yellow-600 dark:text-yellow-400">Partial Success</span>
                      </div>
                      <div className="flex justify-between">
                        <span>5-6:</span>
                        <span className="text-green-600 dark:text-green-400">Full Success</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Modifiers</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <div>Character Expertise: <strong className="text-green-600 dark:text-green-400">+1</strong></div>
                      <div>Favorable Conditions: <strong className="text-green-600 dark:text-green-400">+1</strong></div>
                      <div>Challenging Conditions: <strong className="text-yellow-600 dark:text-yellow-400">-1</strong></div>
                      <div>Extreme Conditions: <strong className="text-red-600 dark:text-red-400">-2</strong></div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Health</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <div>3 HP: <span className="text-green-600 dark:text-green-400">Healthy</span></div>
                      <div>2 HP: <span className="text-yellow-600 dark:text-yellow-400">Wounded</span></div>
                      <div>1 HP: <span className="text-red-600 dark:text-red-400">Badly Hurt (-1 to rolls)</span></div>
                      <div>0 HP: <span className="text-red-800 dark:text-red-200">Unconscious/Dead</span></div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Damage</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <div>Minor: <strong>1 damage</strong></div>
                      <div>Serious: <strong>2 damage</strong></div>
                      <div>Massive: <strong>3 damage</strong></div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Combat Attacks</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <div>1-2: <span className="text-red-600 dark:text-red-400">Miss</span></div>
                      <div>3-4: <span className="text-yellow-600 dark:text-yellow-400">1 damage</span></div>
                      <div>5-6: <span className="text-green-600 dark:text-green-400">2 damage</span></div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Luck Points</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <div>• Auto-succeed on any roll</div>
                      <div>• Avoid 1 damage</div>
                      <div>• Declare helpful coincidence</div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Armor</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <div>Light: <strong>-1 damage (min 0)</strong></div>
                      <div>Heavy: <strong>-2 damage (min 0)</strong></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Designer's Notes */}
            <section>
              <Card variant="feature" className="bg-gradient-to-r from-muted/10 to-accent/5 border border-accent/20">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Designer's Notes</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      The RPG Playbook Narrative System prioritizes character and story over mechanical complexity. 
                      When you're unsure about a rule, ask yourself: "What would make the most interesting story?" 
                      and follow that path.
                    </p>
                    <p>
                      The system assumes competent characters facing meaningful challenges. Players should feel heroic 
                      and capable while still facing genuine risks and consequences.
                    </p>
                    <p>
                      Remember: the dice are there to create uncertainty and drama, not to punish players or showcase 
                      the GM's preparation. Use them wisely, and let the story shine through.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Footer */}
            <section className="text-center py-8 border-t border-border">
              <p className="text-muted-foreground">
                <strong>Simple D6 System</strong> - Version 1.0<br/>
                © 2025 Hylas Research Ltd - All rights reserved
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}