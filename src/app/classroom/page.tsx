import { ClassroomModuleList } from "@/components/classroom-module-list";
import { classroomModules } from "@/data/classroom-modules";
import { PageHeader } from "@/components/page-header";

export default function ClassroomPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-24 pt-8">
      <PageHeader
        label="星空课堂"
        title="把一次聊天延伸成一节小课"
        description="每节课都很短，适合孩子一次认识一个小主题：太阳系、夜空识别、深空、彗星和系外行星。"
        accent="emerald"
      />

      <section className="mt-5">
        <ClassroomModuleList modules={classroomModules} />
      </section>

      <section className="mt-5 rounded-[1.75rem] border border-sky-200/10 bg-sky-300/10 p-5 text-sm leading-7 text-sky-50">
        <p className="text-sm text-sky-200">课堂小约定</p>
        <p className="mt-2">
          先听一个好懂的概念，再完成一个小任务。遇到传说故事时，我们会把想象和科学事实分开放好。
        </p>
      </section>
    </main>
  );
}
