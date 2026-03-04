"use client";

import { useState } from "react";
import { AlertCircle, AlertTriangle, Info, Filter, ArrowRight, Calendar } from "lucide-react";

type EventSeverity = "critical" | "warning" | "info";
type EventCategory = "task" | "spv" | "approval" | "system" | "financial";

type AuditEvent = {
  id: string;
  severity: EventSeverity;
  category: EventCategory;
  action: string;
  description: string;
  entity_type?: string;
  entity_id?: string;
  created_at: string;
  requires_action: boolean;
  action_url?: string;
};

type IntelligentEventLogProps = {
  events: AuditEvent[];
};

export function IntelligentEventLogPanel({ events }: IntelligentEventLogProps) {
  const [severityFilter, setSeverityFilter] = useState<EventSeverity | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "all">("all");

  // Filter events
  const filteredEvents = events.filter((e) => {
    if (severityFilter !== "all" && e.severity !== severityFilter) return false;
    if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
    return true;
  });

  // Count by severity
  const criticalCount = events.filter(e => e.severity === "critical").length;
  const warningCount = events.filter(e => e.severity === "warning").length;
  const infoCount = events.filter(e => e.severity === "info").length;

  // Group by date
  const groupedEvents = groupEventsByDate(filteredEvents);

  return (
    <div className="macos-card shadow-sm">
      <div className="border-b border-[#d1d1d6] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#007AFF]" />
          <div className="text-[14px] font-semibold text-black">Intelligent Event Log</div>
          <div className="flex items-center gap-1 ml-2">
            {criticalCount > 0 && (
              <div className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                {criticalCount} Critical
              </div>
            )}
            {warningCount > 0 && (
              <div className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                {warningCount} Warning
              </div>
            )}
          </div>
        </div>
        <button className="text-[12px] text-[#007AFF] font-medium hover:underline">
          Export Audit Trail
        </button>
      </div>

      {/* FILTERS */}
      <div className="border-b border-[#d1d1d6] px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-black/40" />
          <span className="text-[11px] font-semibold text-black/60 uppercase">Severity:</span>
          <div className="flex items-center gap-1">
            <FilterButton
              label="All"
              active={severityFilter === "all"}
              onClick={() => setSeverityFilter("all")}
            />
            <FilterButton
              label="Critical"
              count={criticalCount}
              active={severityFilter === "critical"}
              onClick={() => setSeverityFilter("critical")}
              color="red"
            />
            <FilterButton
              label="Warning"
              count={warningCount}
              active={severityFilter === "warning"}
              onClick={() => setSeverityFilter("warning")}
              color="amber"
            />
            <FilterButton
              label="Info"
              count={infoCount}
              active={severityFilter === "info"}
              onClick={() => setSeverityFilter("info")}
              color="blue"
            />
          </div>
        </div>

        <div className="h-4 w-px bg-[#d1d1d6]" />

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-black/60 uppercase">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="text-[12px] border border-[#d1d1d6] rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="task">Tasks</option>
            <option value="spv">SPV</option>
            <option value="approval">Approvals</option>
            <option value="financial">Financial</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* EVENT LIST */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <Info size={32} className="mx-auto text-black/20 mb-2" />
            <div className="text-[13px] text-black/40">No events match filters</div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedEvents).map(([date, dateEvents]) => (
              <div key={date}>
                {/* DATE HEADER */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-[11px] font-semibold text-black/60 uppercase">
                    {date}
                  </div>
                  <div className="flex-1 h-px bg-[#d1d1d6]" />
                </div>

                {/* EVENTS FOR THIS DATE */}
                <div className="space-y-2">
                  {dateEvents.map((event) => (
                    <EventRow key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventRow({ event }: { event: AuditEvent }) {
  const severityConfig = {
    critical: {
      icon: AlertCircle,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-900",
    },
    warning: {
      icon: AlertTriangle,
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-900",
    },
    info: {
      icon: Info,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-900",
    },
  };

  const config = severityConfig[event.severity];
  const Icon = config.icon;

  const categoryLabels = {
    task: "Task",
    spv: "SPV",
    approval: "Approval",
    financial: "Financial",
    system: "System",
  };

  return (
    <div
      className={`p-3 rounded-lg border ${config.borderColor} ${event.severity === "info" ? "bg-white" : config.bgColor} hover:shadow-sm transition-all cursor-pointer`}
    >
      <div className="flex items-start gap-3">
        {/* SEVERITY INDICATOR */}
        <div className="flex-shrink-0">
          <div className={`h-8 w-8 rounded-full ${config.color} bg-opacity-20 flex items-center justify-center`}>
            <Icon size={16} className={config.color.replace("bg-", "text-")} />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className={`text-[13px] font-semibold ${event.severity === "info" ? "text-black" : config.textColor}`}>
                {event.action}
              </div>
              <div className="text-[12px] text-black/60 mt-0.5">
                {event.description}
              </div>
              
              {/* META INFO */}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] font-semibold text-black/40 uppercase">
                  {categoryLabels[event.category]}
                </span>
                {event.entity_type && (
                  <span className="text-[10px] text-black/40">
                    {event.entity_type}
                  </span>
                )}
                <span className="text-[10px] text-black/40">
                  {new Date(event.created_at).toLocaleTimeString("hr-HR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* ACTION REQUIRED */}
              {event.requires_action && (
                <div className="mt-2 px-2 py-1 bg-amber-100 border border-amber-300 rounded text-[11px] font-semibold text-amber-900 inline-block">
                  ⚠️ Action Required
                </div>
              )}
            </div>

            {/* ARROW */}
            <ArrowRight size={16} className="text-black/30 flex-shrink-0 mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  label,
  count,
  active,
  onClick,
  color,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  color?: "red" | "amber" | "blue";
}) {
  const colorClasses = {
    red: "bg-red-100 text-red-700 border-red-300",
    amber: "bg-amber-100 text-amber-700 border-amber-300",
    blue: "bg-blue-100 text-blue-700 border-blue-300",
  };

  const activeClass = active
    ? color
      ? colorClasses[color]
      : "bg-[#007AFF] text-white border-[#007AFF]"
    : "bg-white text-black/60 border-[#d1d1d6] hover:bg-black/[0.02]";

  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded text-[11px] font-semibold border transition-all ${activeClass}`}
    >
      {label}
      {count !== undefined && count > 0 && ` (${count})`}
    </button>
  );
}

function groupEventsByDate(events: AuditEvent[]): Record<string, AuditEvent[]> {
  const grouped: Record<string, AuditEvent[]> = {};

  events.forEach((event) => {
    const date = new Date(event.created_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey: string;

    if (date.toDateString() === today.toDateString()) {
      dateKey = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = "Yesterday";
    } else {
      dateKey = date.toLocaleDateString("hr-HR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(event);
  });

  return grouped;
}

// Helper function to generate intelligent audit events
export function generateIntelligentEvents(
  spvList: any[],
  tasks: any[],
  activityLog: any[]
): AuditEvent[] {
  const events: AuditEvent[] = [];
  const now = new Date();

  // Generate critical events from blocked SPVs
  spvList.forEach((spv) => {
    if (spv.is_blocked && spv.overdue > 0) {
      events.push({
        id: `critical-spv-${spv.id}`,
        severity: "critical",
        category: "spv",
        action: `SPV ${spv.spv_code} blocked`,
        description: `${spv.overdue} overdue tasks preventing progress`,
        entity_type: "SPV",
        entity_id: spv.id,
        created_at: new Date(now.getTime() - Math.random() * 3600000).toISOString(),
        requires_action: true,
        action_url: `/dashboard/core/spv/${spv.id}`,
      });
    }
  });

  // Generate warning events from mandatory tasks
  tasks.forEach((task) => {
    if (task.is_mandatory && task.status !== "Zavrsen") {
      events.push({
        id: `warning-task-${task.id}`,
        severity: "warning",
        category: "task",
        action: "Mandatory task pending",
        description: task.title || "Untitled task",
        entity_type: "Task",
        entity_id: task.id,
        created_at: task.due_date || new Date().toISOString(),
        requires_action: true,
      });
    }
  });

  // Convert activity log to info events
  activityLog.slice(0, 10).forEach((log) => {
    events.push({
      id: log.id,
      severity: "info",
      category: "system",
      action: log.action || "Activity",
      description: log.entity_type || "System event",
      entity_type: log.entity_type || undefined,
      created_at: log.created_at || new Date().toISOString(),
      requires_action: false,
    });
  });

  // Sort by date (newest first)
  return events.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}