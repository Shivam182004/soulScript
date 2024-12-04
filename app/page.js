
import { getdailyPrompt } from "@/action/public";
import CallToAction from "@/components/CallToAction";
import FAQs from "@/components/FAQs";
import TestimonialCrousel from "@/components/TestimonialCrousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2, Book, Calendar, ChevronRight, FileText, Lock, Sparkles } from "lucide-react";
import Link from "next/link";


const features = [
  {
    icon: Book,
    title: "Rich Text Editor",
    description:
      "Express yourself with a powerful editor supporting markdown, formatting, and more.",
  },
  {
    icon: Sparkles,
    title: "Daily Inspiration",
    description:
      "Get inspired with daily prompts and mood-based imagery to spark your creativity.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Your thoughts are safe with enterprise-grade security and privacy features.",
  },
];


export default async function Home() {
 const advice = await getdailyPrompt();
  return (
    <div className="relative container mx-auto pt-16 px-4 pb-16 ">
      <div className="max-w-5xl mx-auto text-center space-y-8 ">
        <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 gradient-title">
          Your Thoughts.<br /> Your Canvas.
        </h1>
        <p className="text-lg md:text-xl text-orange-800 mb-8">
          Capture your thoughts, map your mood, and embrace your journey in a secure, elegant space.
        </p>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-orange-50 via-transparent to-transparent pointer-events-none z-10" />
          <div className="bg-white rounded-2xl  p-4 max-full mx-auto">
            <div className="border-b border-orange-100 pb-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <span className="text-orange-900 font-medium">
                  Today&rsquo;s Entry
                </span>
              </div>
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-200" />
                <div className="h-3 w-3 rounded-full bg-orange-300" />
                <div className="h-3 w-3 rounded-full bg-orange-400" />
              </div>
            </div>

            <div className="space-y-4 p-4">
              <h3 className="text-xl font-semibold text-orange-900">
                
              {advice ? advice : "My Thoughts Today"}

              </h3>
              <Skeleton className={"h-4 bg-orange-200 rounded w-3/4"} />
              <Skeleton className={"h-4 bg-orange-200 rounded w-full"} />
              <Skeleton className={"h-4 bg-orange-200 rounded w-2/3"} />
            </div>

          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Link href='/dashboard'>
          <Button 
          variant='journal'
          className='px-8 py-6 rounded-full flex items-center gap-2'>
            Start Writing <ChevronRight className="h-5 w-5"/>
          </Button>
          </Link>
          <Link href='#features'>
          <Button 
          variant='outline'
          className='px-8 py-6 rounded-full border-orange-600 text-orange-600 hover:bg-orange-100'>
            Learn More 
             <ChevronRight className="h-5 w-5"/>
          </Button>
          </Link>
        </div>
      </div>

  {/* Features cards */}
  <section
        id="features"
        className="mt-24 grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => (
          <Card key={index} className="shadow-lg">
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-xl text-orange-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-orange-700">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <div className="space-y-24 mt-24">
        {/* Feature 1 */}
        <div className="grid md:grid-cols-2 gap-12 ">
          <div className="space-y-6">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-orange-900">
              Rich Text Editor
            </h3>
            <p className="text-lg text-orange-700">
              Express yourself fully with our powerful editor featuring:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400" />
                <span>Format text with ease</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400" />
                <span>Embed links</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4 bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
            {/* Editor Preview */}
            <div className="flex gap-2 mb-6">
              <div className="h-8 w-8 rounded bg-orange-100"></div>
              <div className="h-8 w-8 rounded bg-orange-100"></div>
              <div className="h-8 w-8 rounded bg-orange-100"></div>
            </div>
            <div className="h-4 bg-orange-50 rounded w-3/4"></div>
            <div className="h-4 bg-orange-50 rounded w-full"></div>
            <div className="h-4 bg-orange-50 rounded w-2/3"></div>
            <div className="h-4 bg-orange-50 rounded w-1/3"></div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 md:flex-row-reverse">
          <div className="space-y-6 md:order-2">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
              <BarChart2 className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-orange-900">
              Mood Analytics
            </h3>
            <p className="text-lg text-orange-700">
              Track your emotional journey with powerful analytics:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400" />
                <span>Visual mood trends</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400" />
                <span>Pattern recognition</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4 bg-white rounded-2xl shadow-xl p-6 border border-orange-100 md:order-1">
            {/* Analytics Preview */}
            <div className="h-40 bg-gradient-to-t from-orange-100 to-orange-50 rounded-lg"></div>
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-orange-100 rounded"></div>
              <div className="h-4 w-16 bg-orange-100 rounded"></div>
              <div className="h-4 w-16 bg-orange-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    <TestimonialCrousel/>
    <FAQs/>
    <CallToAction/>
      </div>
  
  );
}
