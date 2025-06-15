import React, { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/Card/Card";
import { Badge } from "@/components/Badge/Badge";
import { Button } from "@/components/Button/Button";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
}

interface FAQCategory {
  title: string;
  badge?: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: "About RPG Core & Simple D6",
    badge: "System",
    items: [
      {
        question: "What makes RPG Core stand out?",
        answer:
          "RPG Core is designed to be focused on narrative based games, using the Simple D6 rule set. It's ideal for people who enjoy focusing on the storytelling aspect of RPG games. It's especially good for shorter games, where players can pick up and play almost instantly.",
      },
      {
        question: "Why should I use Simple D6?",
        answer:
          "Simple D6 is designed to be easy to learn, simple to use, and effective. I believe it offers an excellent set of light weight rules, well suited to short adventure games.",
      },
      {
        question: "What if I want to use different rules instead?",
        answer:
          "Go for it! The content of the adventures on RPG Core is narrative in nature. And where dice-based challenges are mentioned, they are always referred to via their difficulty rating (Easy/Medium/Hard) which will make it simple to translate into most other systems. All that matters, is that you and your group have fun. You should use whatever rules you enjoy the most.",
      },
    ],
  },
  {
    title: "Accounts & Pricing",
    badge: "Free",
    items: [
      {
        question: "Why do I need to sign up?",
        answer:
          "You don't need to sign up to use the content I publish myself. An account simply gives you a means of creating your own custom content (assets and adventures). You need an account for this, as these have to be associated to you.",
      },
      {
        question: "Does the app cost?",
        answer: (
          <div className="space-y-3">
            <p>
              Not at the moment. I will likely look to add some premium content
              at some point, if only to support the cost of development and
              maintenance (hosting can get expensive). But right now there is no
              cost.
            </p>
            <p>
              Of course, if you enjoy my content and would like to tip me then I
              have a link to my Patreon below. All tips are greatly appreciated,
              but also completely voluntary.
            </p>
            <div className="pt-2">
              <Button variant="ghost" size="sm" rightIcon={ExternalLink}>
                Support on Patreon
              </Button>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    title: "Content & Art",
    badge: "Creative",
    items: [
      {
        question: "Do you use AI art?",
        answer:
          "No. The art on the website is a combination of my own hand-made art. I draw and paint for a hobby. And also some public domain art – hand-made art that the artists have kindly posted with explicit permission for people to use for commercial purposes. I would love to get to a point where I can commission custom art. At the moment the cost is prohibitive. But if and when the site grows I am keen to explore this.",
      },
      {
        question: "What art can I upload?",
        answer:
          "Your uploads are your own. Nothing is published for viewing by others. However, I do ask you keep your uploaded content reasonable. No explicit content is allowed.",
      },
      {
        question: "Can I share my creations with others?",
        answer:
          "Not yet. But I am looking into this feature soon. It requires I add moderation tools, which I need time to work on before I can go down this route. But I would love to allow user-created content sharing. It just needs to be done in a robust way that ensures this remain a fun space for everyone involved.",
      },
      {
        question: "Are your games suitable for all audiences?",
        answer:
          "No. We provide a suggested age rating for each of our games based on the themes and content. While there is nothing in any of the game assets that is itself adult in nature, some of the games have scary themes or draw on ideas and moral choices that are better suited to a more mature audience. Our games are all tagged, showing you the suitable audience maturity level.",
      },
    ],
  },
];

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Card variant="elevated" className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-accent/5 transition-colors"
      >
        <h3 className="font-semibold text-lg pr-4">{item.question}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <CardContent className="px-6 pb-6 pt-4 border-t border-border mt-2">
          <div className="prose max-w-none text-muted-foreground">
            {typeof item.answer === "string" ? (
              <p>{item.answer}</p>
            ) : (
              item.answer
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function FAQCategory({ category }: { category: FAQCategory }) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">{category.title}</h2>
        {category.badge && (
          <Badge variant="outline" size="sm">
            {category.badge}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {category.items.map((item, index) => (
          <FAQAccordionItem
            key={index}
            item={item}
            isOpen={openItems.has(index)}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>
    </section>
  );
}

export function FAQPage() {
  return (
    <div className="min-h-full bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-card to-background border-b border-border py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Everything you need to know about RPG Core and Simple D6
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-12">
        {faqData.map((category, index) => (
          <FAQCategory key={index} category={category} />
        ))}

        {/* Additional Help Section */}
        <section className="pt-12 border-t border-border">
          <Card
            variant="feature"
            className="bg-accent/5 border border-accent/20 text-center"
          >
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Feel free to reach out and
                I'll be happy to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary">Contact Support</Button>
                <Button variant="secondary" rightIcon={ExternalLink}>
                  Join Discord Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
