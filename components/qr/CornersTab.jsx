"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Square as SquareIcon, Circle } from "lucide-react";

export default function CornersTab({
  cornerSquareType, setCornerSquareType,
  cornerSquareColor, setCornerSquareColor,
  cornerDotType, setCornerDotType,
  cornerDotColor, setCornerDotColor,
  cornerSquareTypes,
  cornerDotTypes,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div>
        <Label className="block mb-1 flex items-center gap-2"><SquareIcon className="size-4"/> Corner square</Label>
        <Select value={cornerSquareType} onValueChange={setCornerSquareType}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            {cornerSquareTypes.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-2"><SquareIcon className="size-4"/> Corner square color</label>
        <Input type="color" value={cornerSquareColor} onChange={(e) => setCornerSquareColor(e.target.value)} className="h-10 w-full cursor-pointer" />
      </div>
      <div>
        <Label className="block mb-1 flex items-center gap-2"><Circle className="size-4"/> Corner dot</Label>
        <Select value={cornerDotType} onValueChange={setCornerDotType}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            {cornerDotTypes.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Circle className="size-4"/> Corner dot color</label>
        <Input type="color" value={cornerDotColor} onChange={(e) => setCornerDotColor(e.target.value)} className="h-10 w-full cursor-pointer" />
      </div>
    </div>
  );
}

