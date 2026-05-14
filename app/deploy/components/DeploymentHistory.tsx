import { ExternalLink, History, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type DeploymentHistoryItem } from "./types";

type DeploymentHistoryProps = {
  history: DeploymentHistoryItem[];
};

export function DeploymentHistory({ history }: DeploymentHistoryProps) {
  return (
    <Card className="bg-white/[0.045]">
      <CardHeader className="border-b border-white/10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <History className="h-5 w-5 text-primary" />
              Publish History
            </CardTitle>
            <CardDescription>
              Review recent GitHub pushes, package modes, and quick actions.
            </CardDescription>
          </div>
          <Badge variant="secondary">{history.length} records</Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="hidden grid-cols-4 gap-3 border-b border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground md:grid">
            <div className="min-w-0">Date</div>
            <div className="min-w-0">Status</div>
            <div className="min-w-0">URL</div>
            <div className="min-w-0">Action</div>
          </div>

          <div className="divide-y divide-white/10">
            {history.map((item) => (
              <div
                key={item.id}
                className="grid min-w-0 grid-cols-1 gap-3 px-4 py-4 text-sm transition hover:bg-white/[0.04] md:grid-cols-4 md:items-center"
              >
                <div className="min-w-0 text-slate-200">{item.date}</div>
                <div className="min-w-0">
                  <Badge
                    variant={
                      item.status === "Pushed"
                        ? "success"
                        : item.status === "Preview"
                          ? "secondary"
                          : "default"
                    }
                    className="w-fit"
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="min-w-0 break-all text-slate-300 md:truncate">{item.url}</div>
                <div className="min-w-0">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`https://${item.url}`} target="_blank" rel="noreferrer">
                      View
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <MoreHorizontal className="h-3.5 w-3.5" />
          Local package history
        </div>
      </CardContent>
    </Card>
  );
}
