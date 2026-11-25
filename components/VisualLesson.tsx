"use client";

import type { Lesson } from "@/lib/curriculum/types";
import type { VisualDoc } from "@/lib/page";
import { BrowserSim, PartsTap, QuizActivity, SafeSort, SketchStep } from "./Activities";
import { LessonPanel } from "./LessonPanel";
import { VisualEditor } from "./VisualEditor";

export function VisualLesson({ lesson, doc, nickname, completed }: { lesson: Lesson; doc: VisualDoc; nickname: string; completed: boolean }) {
  const a = lesson.activity!;
  return (
    <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <div className="lg:max-h-[calc(100vh-164px)] lg:overflow-y-auto lg:pr-2">
        <LessonPanel lesson={lesson} completed={completed} />
      </div>
      <div>
        {a.type === "quiz" && <QuizActivity items={a.items} no={lesson.no} />}
        {a.type === "browser" && <BrowserSim level={a.level} missions={a.missions} no={lesson.no} />}
        {a.type === "safe" && <SafeSort items={a.items} no={lesson.no} />}
        {a.type === "parts" && <PartsTap targets={a.targets} no={lesson.no} />}
        {a.type === "sketch" && <SketchStep level={a.level} checklist={a.checklist} no={lesson.no} />}
        {a.type === "editor" && <VisualEditor level={lesson.level} step={a.step} initial={doc} nickname={nickname.replace(/ \(demo\)$/, "")} />}
      </div>
    </div>
  );
}
