import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, 
  Plus, 
  X, 
  AlertTriangle, 
  Settings,
  Tag,
  Calendar,
  Target,
  Bell
} from "lucide-react";
import { AppBudget, CreateBudgetRequest, UpdateBudgetRequest } from "@/services/budgetService";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budgetData: CreateBudgetRequest | UpdateBudgetRequest) => Promise<void>;
  budget?: AppBudget | null;
  isLoading?: boolean;
}

export const BudgetModal = ({
  isOpen,
  onClose,
  onSave,
  budget,
  isLoading = false
}: BudgetModalProps) => {
  const [formData, setFormData] = useState<CreateBudgetRequest>({
    budgetName: '',
    monthlyLimit: 0,
    currency: 'USD',
    alertThreshold: 80,
    alertFrequency: 'daily',
    services: [],
    tags: {},
    notifications: {
      sns: false,
      email: true,
      webhookUrl: null,
      slack: false
    }
  });

  const [newTag, setNewTag] = useState('');
  const [newTagValue, setNewTagValue] = useState('');
  const [newService, setNewService] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (budget) {
      setFormData({
        budgetName: budget.budgetName,
        monthlyLimit: budget.monthlyLimit,
        currency: budget.currency,
        alertThreshold: budget.alertThreshold,
        alertFrequency: budget.alertFrequency,
        services: budget.services,
        tags: budget.tags,
        notifications: budget.notifications
      });
    } else {
      // Reset form for new budget
      setFormData({
        budgetName: '',
        monthlyLimit: 0,
        currency: 'USD',
        alertThreshold: 80,
        alertFrequency: 'daily',
        services: [],
        tags: {},
        notifications: {
          sns: false,
          email: true,
          webhookUrl: null,
          slack: false
        }
      });
    }
    setErrors({});
  }, [budget, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.budgetName.trim()) {
      newErrors.budgetName = 'Budget name is required';
    }

    if (formData.monthlyLimit <= 0) {
      newErrors.monthlyLimit = 'Monthly limit must be greater than 0';
    }

    if (formData.alertThreshold <= 0 || formData.alertThreshold > 100) {
      newErrors.alertThreshold = 'Alert threshold must be between 1 and 100';
    }

    if (formData.services.length === 0) {
      newErrors.services = 'At least one AWS service must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (budget) {
        // Update existing budget
        await onSave({
          ...formData,
          budgetId: budget.budgetId,
          isActive: budget.isActive
        } as UpdateBudgetRequest);
      } else {
        // Create new budget
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && newTagValue.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: {
          ...prev.tags,
          [newTag.trim()]: newTagValue.trim()
        }
      }));
      setNewTag('');
      setNewTagValue('');
    }
  };

  const removeTag = (tagKey: string) => {
    setFormData(prev => {
      const newTags = { ...prev.tags };
      delete newTags[tagKey];
      return {
        ...prev,
        tags: newTags
      };
    });
  };

  const addService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeService = (serviceToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(service => service !== serviceToRemove)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            {budget ? 'Edit Budget' : 'Create New Budget'}
          </DialogTitle>
          <DialogDescription>
            {budget ? 'Update your custom budget settings' : 'Create a custom budget with advanced rules and notifications'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="alerts">Alerts & Services</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetName">Budget Name *</Label>
                  <Input
                    id="budgetName"
                    value={formData.budgetName}
                    onChange={(e) => setFormData(prev => ({ ...prev, budgetName: e.target.value }))}
                    placeholder="e.g., Monthly AWS Spend"
                    className={errors.budgetName ? 'border-red-500' : ''}
                  />
                  {errors.budgetName && (
                    <p className="text-sm text-red-600">{errors.budgetName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyLimit">Monthly Limit *</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthlyLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthlyLimit: parseFloat(e.target.value) || 0 }))}
                    placeholder="100.00"
                    className={errors.monthlyLimit ? 'border-red-500' : ''}
                  />
                  {errors.monthlyLimit && (
                    <p className="text-sm text-red-600">{errors.monthlyLimit}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alertFrequency">Alert Frequency</Label>
                  <Select value={formData.alertFrequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setFormData(prev => ({ ...prev, alertFrequency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Tag name (e.g., Environment)"
                  />
                  <div className="flex space-x-2">
                    <Input
                      value={newTagValue}
                      onChange={(e) => setNewTagValue(e.target.value)}
                      placeholder="Tag value (e.g., Production)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(formData.tags || {}).map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="flex items-center space-x-1">
                      <Tag className="h-3 w-3" />
                      <span>{key}: {value}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(key)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Alerts & Services Tab */}
            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Alert Threshold
                  </CardTitle>
                  <CardDescription>
                    Set percentage threshold to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label className="w-20">Threshold:</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.alertThreshold}
                      onChange={(e) => setFormData(prev => ({ ...prev, alertThreshold: parseInt(e.target.value) || 80 }))}
                      className="w-20"
                    />
                    <span className="text-sm text-slate-600">%</span>
                  </div>

                  {errors.alertThreshold && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{errors.alertThreshold}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* AWS Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AWS Services</CardTitle>
                  <CardDescription>Select AWS services to monitor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="e.g., EC2, S3, Lambda"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                    />
                    <Button type="button" onClick={addService} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.services.map((service, index) => (
                      <Badge key={index} variant="outline" className="flex items-center space-x-1">
                        <span>{service}</span>
                        <button
                          type="button"
                          onClick={() => removeService(service)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Bell className="h-5 w-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to receive budget alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Receive alerts via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={formData.notifications.email}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, email: checked }
                          }))
                        }
                      />
                    </div>

                    {/* Disabled notification methods */}
                    <div className="flex items-center justify-between opacity-50">
                      <div>
                        <Label>SNS Notifications</Label>
                        <p className="text-sm text-slate-400">Coming soon - AWS SNS integration</p>
                      </div>
                      <Switch disabled checked={false} />
                    </div>

                    <div className="flex items-center justify-between opacity-50">
                      <div>
                        <Label>Slack Notifications</Label>
                        <p className="text-sm text-slate-400">Coming soon - Slack integration</p>
                      </div>
                      <Switch disabled checked={false} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : budget ? 'Update Budget' : 'Create Budget'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
