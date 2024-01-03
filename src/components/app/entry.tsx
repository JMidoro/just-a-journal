import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "../ui/card"
import { SVGProps } from "react"
import { Textarea } from "../ui/textarea"

import {useEffect, useState} from 'react'
import { Button } from "../ui/button"

const Entry = () => {
  useEffect(() => {
      const setClearInterval = () => {
          const now = new Date();
          const untilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0).getTime() - now.getTime();
          const interval = setInterval(() => {
              setEntry("")
              clearInterval(interval)
              setClearInterval()
          }, untilMidnight);
      }

      setClearInterval()
  }, [])
  
  
  const timeouts: NodeJS.Timeout[] = [];

  const debounceSave = (text: string, delay: number) => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.push(setTimeout(() => {
          saveEntry(text)
          setEntry(text)
      }, delay));
  }
  const [entry, setEntry] = useState("")

  const saveEntry = (text: string) => {
      fetch("/save", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({text})
      })
  }

  useEffect(() => {
      fetch("/active")
          .then((res) => res.json())
          .then((res) => setEntry(res.text))
  }, [])

  return (
    <Card
      className="w-full max-w-lg bg-[#D0D0D0] shadow-lg rounded-lg overflow-hidden"
      style={{
        boxShadow:
          "0px -9px 30px 0px rgba(255,255,255,0.13), 0px 9px 23px -2px #000000, inset 0px 4px 11px 0px rgba(255,255,255,0.05), inset 0px -4px 30px -8px rgba(0,0,0,0.17)",
      }}
    >
      <CardHeader>
        <CardTitle className="text-xl font-bold text-black">Journal Entry</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <Textarea
          className="w-full h-full min-h-[400px] border-none resize-none text-black"
          id="entry"
          placeholder="Write here."
          defaultValue={entry}
          onChange={(e) => {
              debounceSave(e.target.value, 30000)
          }}
        ></Textarea>
      </CardContent>
      <CardFooter className="flex justify-between items-end">
        <p className="text-sm text-gray-600 py-2">Your entry will be saved automatically.</p>
        <div className="flex space-x-2">
          <Button className="mt-2 mb-2 bg-black text-white">Save Entry</Button>
          <Button className="mt-2 mb-2 bg-black text-white">
            <MicIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function MicIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  )
}

export default Entry