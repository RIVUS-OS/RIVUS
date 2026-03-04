"use client";

import { AlertCircle, Clock, CheckCircle, ArrowRight, User, FileText } from "lucide-react";

type NextAction = {
  id: string;
  priority: "critical" | "urgent" | "important" | "routine";
  category: "core_action" | "vertical_escalation" | "approval_required" | "lifecycle_step";
  title: string;
  description: string;
  spv_code?: string;
  due_date?: string;
  assigned_to?: string;
  action_url?: string;
};

type NextActionPanelProps = {
  actions: NextAction[];
};

export function NextActionPanel({ actions }: NextActionPanelProps) {
  // Group by priority
  const critical = actions.filter(a => a.priority === "critical");
  const urgent = actions.filter(a => a.priority === "urgent");
  const important = actions.filter(a => a.priority === "important");

  // Get top 10 actions
  const topActions = [
    ...critical.slice(0, 5),
    ...urgent.slice(0, 3),
    ...important.slice(0, 2),
  ].slice(0, 10);

  return (
    <div className="macos-card shadow-sm">
      <div className="border-b border-[#d1d1d6] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-[#007AFF]" />
          <div className="text-[14px] font-semibold text-black">Next Actions</div>
          <div className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">
            {critical.length}
          </div>
        </div>
        <button className="text-[12px] text-[#007AFF] font-medium hover:underline">
          Vidi sve
        </button>
      </div>

      <div className="p-4">
        {/* SUMMARY STATS */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <StatBadge label="Critical" count={critical.length} color="red" />
          <StatBadge label="Urgent" count={urgent.length} color="amber" />
          <StatBadge label="Important" count={important.length} color="blue" />
          <StatBadge label="Total" count={actions.length} color="gray" />
        </div>

        {/* ACTION LIST */}
        {topActions.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle size={32} className="mx-auto text-emerald-500 mb-2" />
            <div className="text-[13px] text-black/40">Nema kriticnih akcija</div>
          </div>
        ) : (
          <div className="space-y-2">
            {topActions.map((action) => (
              <ActionRow key={action.id} action={action} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionRow({ action }: { action: NextAction }) {
  const priorityConfig = {
    critical: { color: "bg-red-500", label: "CRITICAL", textColor: "text-red-700", bgColor: "bg-red-50" },
    urgent: { color: "bg-amber-500", label: "URGENT", textColor: "text-amber-700", bgColor: "bg-amber-50" },
    important: { color: "bg-blue-500", label: "IMPORTANT", textColor: "text-blue-700", bgColor: "bg-blue-50" },
    routine: { color: "bg-gray-500", label: "ROUTINE", textColor: "text-gray-700", bgColor: "bg-gray-50" },
  };

  const categoryIcon = {
    core_action: <AlertCircle size={16} />,
    vertical_escalation: <User size={16} />,
    approval_required: <FileText size={16} />,
    lifecycle_step: <Clock size={16} />,
  };

  const config = priorityConfig[action.priority];

  return (
    <div className={`p-3 rounded-lg border border-[#d1d1d6] hover:bg-black/[0.02] cursor-pointer transition-colors ${config.bgColor}`}>
      <div className="flex items-start gap-3">
        {/* PRIORITY DOT */}
        <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${config.color}`} />

        {/* CATEGORY ICON */}
        <div className="flex-shrink-0 text-black/60">
          {categoryIcon[action.category]}
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-black">
                {action.title}
              </div>
              <div className="text-[12px] text-black/60 mt-0.5">
                {action.description}
              </div>
              
              {/* META INFO */}
              <div className="flex items-center gap-3 mt-2">
                {action.spv_code && (
                  <span className="text-[11px] font-medium text-black/50">
                    SPV: {action.spv_code}
                  </span>
                )}
                {action.due_date && (
                  <span className="text-[11px] font-medium text-red-600">
                    Due: {new Date(action.due_date).toLocaleDateString("hr-HR")}
                  </span>
                )}
                {action.assigned_to && (
                  <span className="text-[11px] font-medium text-black/50">
                    → {action.assigned_to}
                  </span>
                )}
              </div>
            </div>

            {/* PRIORITY BADGE */}
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${config.textColor} ${config.bgColor} border border-current`}>
              {config.label}
            </div>
          </div>
        </div>

        {/* ARROW */}
        <ArrowRight size={16} className="text-black/30 flex-shrink-0 mt-1" />
      </div>
    </div>
  );
}

function StatBadge({ label, count, color }: { label: string; count: number; color: "red" | "amber" | "blue" | "gray" }) {
  const colorConfig = {
    red: "bg-red-50 text-red-700 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <div className={`p-3 rounded-lg border ${colorConfig[color]}`}>
      <div className="text-[11px] font-semibold uppercase opacity-70">{label}</div>
      <div className="text-[20px] font-bold mt-1">{count}</div>
    </div>
  );
}

// Helper function to determine next actions from SPV data
export function generateNextActions(spvList: any[], tasks: any[]): NextAction[] {
  const actions: NextAction[] = [];
  const today = new Date().toISOString();

  spvList.forEach((spv) => {
    // CRITICAL: Blocked SPV with overdue tasks
    if (spv.overdue > 0 && spv.is_blocked) {
      actions.push({
        id: `critical-${spv.id}`,
        priority: "critical",
        category: "core_action",
        title: `Resolve blocked SPV: ${spv.spv_code}`,
        description: `${spv.overdue} overdue tasks blocking progress`,
        spv_code: spv.spv_code,
        due_date: today,
      });
    }

    // URGENT: Mandatory tasks open
    if (spv.mandatory > 0) {
      actions.push({
        id: `urgent-${spv.id}`,
        priority: "urgent",
        category: "core_action",
        title: `Complete mandatory tasks: ${spv.spv_code}`,
        description: `${spv.mandatory} mandatory tasks require completion`,
        spv_code: spv.spv_code,
      });
    }

    // IMPORTANT: High risk score
    if (spv.risk_score > 25) {
      actions.push({
        id: `important-risk-${spv.id}`,
        priority: "important",
        category: "vertical_escalation",
        title: `Escalate high-risk SPV: ${spv.spv_code}`,
        description: `Risk score: ${spv.risk_score.toFixed(1)} - requires vertical attention`,
        spv_code: spv.spv_code,
        assigned_to: "Vertical Lead",
      });
    }
  });

  return actions.sort((a, b) => {
    const priorityOrder = { critical: 0, urgent: 1, important: 2, routine: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}