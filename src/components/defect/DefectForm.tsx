import type { Defect, DefectPriority, DefectSeverity } from "@/lib/defects-store";

interface DefectFormProps {
  defect?: Partial<Defect>;
  readOnly?: boolean;

  title?: string;
  setTitle?: (value: string) => void;

  projectId?: string;
  setProjectId?: (value: string) => void;

  team?: string;
  setTeam?: (value: string) => void;

  assigneeId?: string;
  setAssigneeId?: (value: string) => void;

  priority?: DefectPriority;
  setPriority?: (value: DefectPriority) => void;

  severity?: DefectSeverity;
  setSeverity?: (value: DefectSeverity) => void;

  environment?: string;
  setEnvironment?: (value: string) => void;

  dueDate?: string;
  setDueDate?: (value: string) => void;

  description?: string;
  setDescription?: (value: string) => void;

  stepsToReproduce?: string;
  setStepsToReproduce?: (value: string) => void;

  expectedResult?: string;
  setExpectedResult?: (value: string) => void;

  actualResult?: string;
  setActualResult?: (value: string) => void;

  errors?: Record<string, string>;
}

export default function DefectForm({
  defect,
  readOnly = false,

  title,
  setTitle,

  projectId,
  setProjectId,

  team,
  setTeam,

  assigneeId,
  setAssigneeId,

  priority,
  setPriority,

  severity,
  setSeverity,

  environment,
  setEnvironment,

  dueDate,
  setDueDate,

  description,
  setDescription,

  stepsToReproduce,
  setStepsToReproduce,

  expectedResult,
  setExpectedResult,

  actualResult,
  setActualResult,

  errors = {},
}: DefectFormProps) {
  return (
    <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
        <div>
          <h2 className="text-xl font-semibold">{readOnly ? "Defect Details" : "Create Defect"}</h2>

          <p className="text-sm text-muted-foreground">
            {readOnly ? "View defect information" : "Create a defect"}
          </p>
        </div>
      </div>

      <div className="p-6"></div>
    </div>
  );
}
