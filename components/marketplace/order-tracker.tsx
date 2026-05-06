'use client';

import { Order, mockProviders } from '@/lib/mock-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface OrderTrackerProps {
  orders: Order[];
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig = {
  'quote-requested': {
    icon: Clock,
    label: 'Quote Requested',
    color: 'bg-blue-500',
    variant: 'default' as const,
  },
  'quote-provided': {
    icon: AlertCircle,
    label: 'Quote Provided',
    color: 'bg-yellow-500',
    variant: 'secondary' as const,
  },
  'accepted': {
    icon: CheckCircle2,
    label: 'Quote Accepted',
    color: 'bg-purple-500',
    variant: 'default' as const,
  },
  'in-progress': {
    icon: Clock,
    label: 'In Progress',
    color: 'bg-blue-500',
    variant: 'default' as const,
  },
  'completed': {
    icon: CheckCircle2,
    label: 'Completed',
    color: 'bg-green-500',
    variant: 'default' as const,
  },
};

const statusOrder = [
  'quote-requested',
  'quote-provided',
  'accepted',
  'in-progress',
  'completed',
];

export function OrderTracker({ orders, isOpen, onClose }: OrderTrackerProps) {
  if (orders.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Order Tracking</DialogTitle>
          </DialogHeader>
          <div className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium mb-1">No Active Orders</p>
            <p className="text-sm text-muted-foreground">
              Your quote requests will appear here
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Order Tracking</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {orders.map((order) => {
            const provider = mockProviders.find((p) => p.id === order.providerId);
            const currentStatusIndex = statusOrder.indexOf(order.status);

            return (
              <div
                key={order.id}
                className="p-4 bg-secondary rounded-lg space-y-4 border border-border"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {provider?.name || 'Unknown Provider'}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Order ID: {order.id}
                    </p>
                  </div>
                  <Badge variant="default" className="bg-accent">
                    {statusConfig[order.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  {statusOrder.map((status, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const StatusIcon =
                      statusConfig[status as keyof typeof statusConfig].icon;

                    return (
                      <div key={status} className="flex gap-4">
                        {/* Timeline Dot */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                              isCompleted
                                ? 'bg-accent border-accent'
                                : 'bg-transparent border-muted'
                            }`}
                          >
                            <StatusIcon
                              className={`w-4 h-4 ${
                                isCompleted ? 'text-accent-foreground' : 'text-muted'
                              }`}
                            />
                          </div>
                          {index < statusOrder.length - 1 && (
                            <div
                              className={`w-0.5 h-12 ${
                                isCompleted ? 'bg-accent' : 'bg-muted'
                              }`}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <p
                            className={`font-medium text-sm ${
                              isCompleted
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {statusConfig[status as keyof typeof statusConfig]
                              .label}
                          </p>
                          {isCurrent && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Updated{' '}
                              {new Date(order.updatedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Files & Details */}
                <div className="pt-3 border-t border-border/50 space-y-3">
                  {order.files.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Uploaded Files
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {order.files.map((file) => (
                          <Badge
                            key={file}
                            variant="secondary"
                            className="text-xs"
                          >
                            {file}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {order.budget && (
                      <div>
                        <p className="text-muted-foreground mb-1">Budget</p>
                        <p className="font-medium text-foreground">
                          ₱{order.budget}
                        </p>
                      </div>
                    )}
                    {order.turnaroundRequest && (
                      <div>
                        <p className="text-muted-foreground mb-1">
                          Requested Turnaround
                        </p>
                        <p className="font-medium text-foreground">
                          {order.turnaroundRequest} days
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
