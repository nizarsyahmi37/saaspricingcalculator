'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, Users, DollarSign, BarChart3, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import BoltBadge from '@/components/BoltBadge';

interface PricingModel {
  type: 'freemium' | 'tiered' | 'usage-based';
  name: string;
  description: string;
}

interface TierConfig {
  name: string;
  price: number;
  users: number;
  features: string[];
}

interface UsageConfig {
  basePrice: number;
  unitPrice: number;
  unitName: string;
  includedUnits: number;
}

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<PricingModel['type']>('freemium');
  const [customerCount, setCustomerCount] = useState([1000]);
  const [conversionRate, setConversionRate] = useState([5]);
  const [churnRate, setChurnRate] = useState([5]);
  const [growthRate, setGrowthRate] = useState([10]);
  
  // Freemium settings
  const [freemiumTiers, setFreemiumTiers] = useState<TierConfig[]>([
    { name: 'Free', price: 0, users: 3, features: ['Basic features', 'Email support'] },
    { name: 'Pro', price: 29, users: 10, features: ['All features', 'Priority support', 'Analytics'] },
    { name: 'Enterprise', price: 99, users: 50, features: ['Everything', 'Custom integrations', 'Dedicated support'] }
  ]);

  // Tiered settings
  const [tieredPlans, setTieredPlans] = useState<TierConfig[]>([
    { name: 'Starter', price: 19, users: 5, features: ['Core features', 'Email support'] },
    { name: 'Professional', price: 49, users: 15, features: ['Advanced features', 'Priority support'] },
    { name: 'Enterprise', price: 149, users: 100, features: ['All features', 'Custom solutions'] }
  ]);

  // Usage-based settings
  const [usageConfig, setUsageConfig] = useState<UsageConfig>({
    basePrice: 10,
    unitPrice: 0.05,
    unitName: 'API calls',
    includedUnits: 1000
  });

  const [averageUsage, setAverageUsage] = useState([5000]);

  const pricingModels: PricingModel[] = [
    {
      type: 'freemium',
      name: 'Freemium',
      description: 'Free tier with paid upgrades'
    },
    {
      type: 'tiered',
      name: 'Tiered Pricing',
      description: 'Multiple pricing tiers'
    },
    {
      type: 'usage-based',
      name: 'Usage-Based',
      description: 'Pay per usage/consumption'
    }
  ];

  const calculateFreemiumRevenue = () => {
    const totalCustomers = customerCount[0];
    const conversionToProRate = conversionRate[0] / 100;
    const conversionToEnterpriseRate = (conversionRate[0] / 100) * 0.2; // 20% of conversions go to enterprise
    
    const freeUsers = totalCustomers * (1 - conversionToProRate - conversionToEnterpriseRate);
    const proUsers = totalCustomers * conversionToProRate * 0.8; // 80% go to Pro
    const enterpriseUsers = totalCustomers * conversionToEnterpriseRate;
    
    const monthlyRevenue = (proUsers * freemiumTiers[1].price) + (enterpriseUsers * freemiumTiers[2].price);
    const annualRevenue = monthlyRevenue * 12;
    
    return {
      mrr: monthlyRevenue,
      arr: annualRevenue,
      freeUsers: Math.round(freeUsers),
      proUsers: Math.round(proUsers),
      enterpriseUsers: Math.round(enterpriseUsers),
      totalPaidUsers: Math.round(proUsers + enterpriseUsers)
    };
  };

  const calculateTieredRevenue = () => {
    const totalCustomers = customerCount[0];
    
    // Distribution across tiers (typical SaaS distribution)
    const starterUsers = totalCustomers * 0.6;
    const professionalUsers = totalCustomers * 0.3;
    const enterpriseUsers = totalCustomers * 0.1;
    
    const monthlyRevenue = 
      (starterUsers * tieredPlans[0].price) + 
      (professionalUsers * tieredPlans[1].price) + 
      (enterpriseUsers * tieredPlans[2].price);
    const annualRevenue = monthlyRevenue * 12;
    
    return {
      mrr: monthlyRevenue,
      arr: annualRevenue,
      starterUsers: Math.round(starterUsers),
      professionalUsers: Math.round(professionalUsers),
      enterpriseUsers: Math.round(enterpriseUsers),
      totalUsers: totalCustomers
    };
  };

  const calculateUsageRevenue = () => {
    const totalCustomers = customerCount[0];
    const avgUsagePerCustomer = averageUsage[0];
    
    const overage = Math.max(0, avgUsagePerCustomer - usageConfig.includedUnits);
    const overageRevenue = overage * usageConfig.unitPrice;
    
    const monthlyRevenue = totalCustomers * (usageConfig.basePrice + overageRevenue);
    const annualRevenue = monthlyRevenue * 12;
    
    return {
      mrr: monthlyRevenue,
      arr: annualRevenue,
      totalCustomers,
      averageUsage: avgUsagePerCustomer,
      overageRevenue: overageRevenue,
      baseRevenue: usageConfig.basePrice
    };
  };

  const getRevenueData = () => {
    switch (selectedModel) {
      case 'freemium':
        return calculateFreemiumRevenue();
      case 'tiered':
        return calculateTieredRevenue();
      case 'usage-based':
        return calculateUsageRevenue();
      default:
        return { mrr: 0, arr: 0 };
    }
  };

  const revenueData = getRevenueData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const updateTierPrice = (index: number, price: number, isFreemium: boolean = false) => {
    if (isFreemium) {
      const newTiers = [...freemiumTiers];
      newTiers[index].price = price;
      setFreemiumTiers(newTiers);
    } else {
      const newTiers = [...tieredPlans];
      newTiers[index].price = price;
      setTieredPlans(newTiers);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <BoltBadge />
      
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              SaaS Pricing Calculator
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simulate different pricing models and estimate your MRR/ARR potential. 
            Perfect for startups planning their pricing strategy.
          </p>
        </div>

        {/* Model Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {pricingModels.map((model) => (
            <Card 
              key={model.type}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedModel === model.type 
                  ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedModel(model.type)}
            >
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  {model.type === 'freemium' && <Users className="h-5 w-5" />}
                  {model.type === 'tiered' && <BarChart3 className="h-5 w-5" />}
                  {model.type === 'usage-based' && <TrendingUp className="h-5 w-5" />}
                  {model.name}
                </CardTitle>
                <CardDescription>{model.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  Adjust your pricing model parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedModel} onValueChange={(value) => setSelectedModel(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="freemium">Freemium</TabsTrigger>
                    <TabsTrigger value="tiered">Tiered</TabsTrigger>
                    <TabsTrigger value="usage-based">Usage-Based</TabsTrigger>
                  </TabsList>

                  {/* Common Settings */}
                  <div className="mt-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Total Customers: {customerCount[0].toLocaleString()}</Label>
                        <Slider
                          value={customerCount}
                          onValueChange={setCustomerCount}
                          max={10000}
                          min={100}
                          step={100}
                          className="w-full"
                        />
                      </div>
                      
                      {selectedModel !== 'usage-based' && (
                        <div className="space-y-2">
                          <Label>Conversion Rate: {conversionRate[0]}%</Label>
                          <Slider
                            value={conversionRate}
                            onValueChange={setConversionRate}
                            max={20}
                            min={1}
                            step={0.5}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Monthly Churn Rate: {churnRate[0]}%</Label>
                        <Slider
                          value={churnRate}
                          onValueChange={setChurnRate}
                          max={15}
                          min={1}
                          step={0.5}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Monthly Growth Rate: {growthRate[0]}%</Label>
                        <Slider
                          value={growthRate}
                          onValueChange={setGrowthRate}
                          max={25}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <TabsContent value="freemium" className="space-y-6">
                    <h3 className="text-lg font-semibold">Freemium Tiers</h3>
                    <div className="grid gap-4">
                      {freemiumTiers.map((tier, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-gray-50">
                          <div className="grid md:grid-cols-3 gap-4 items-center">
                            <div>
                              <Label className="font-medium">{tier.name}</Label>
                              <p className="text-sm text-gray-600">{tier.users} users max</p>
                            </div>
                            <div>
                              <Label>Price per month</Label>
                              <Input
                                type="number"
                                value={tier.price}
                                onChange={(e) => updateTierPrice(index, Number(e.target.value), true)}
                                disabled={index === 0}
                                className="mt-1"
                              />
                            </div>
                            <div className="text-sm text-gray-600">
                              {tier.features.join(', ')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="tiered" className="space-y-6">
                    <h3 className="text-lg font-semibold">Pricing Tiers</h3>
                    <div className="grid gap-4">
                      {tieredPlans.map((tier, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-gray-50">
                          <div className="grid md:grid-cols-3 gap-4 items-center">
                            <div>
                              <Label className="font-medium">{tier.name}</Label>
                              <p className="text-sm text-gray-600">{tier.users} users max</p>
                            </div>
                            <div>
                              <Label>Price per month</Label>
                              <Input
                                type="number"
                                value={tier.price}
                                onChange={(e) => updateTierPrice(index, Number(e.target.value))}
                                className="mt-1"
                              />
                            </div>
                            <div className="text-sm text-gray-600">
                              {tier.features.join(', ')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="usage-based" className="space-y-6">
                    <h3 className="text-lg font-semibold">Usage-Based Pricing</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Base Price (monthly)</Label>
                          <Input
                            type="number"
                            value={usageConfig.basePrice}
                            onChange={(e) => setUsageConfig({...usageConfig, basePrice: Number(e.target.value)})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Unit Name</Label>
                          <Input
                            value={usageConfig.unitName}
                            onChange={(e) => setUsageConfig({...usageConfig, unitName: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label>Price per Unit</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={usageConfig.unitPrice}
                            onChange={(e) => setUsageConfig({...usageConfig, unitPrice: Number(e.target.value)})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Included Units</Label>
                          <Input
                            type="number"
                            value={usageConfig.includedUnits}
                            onChange={(e) => setUsageConfig({...usageConfig, includedUnits: Number(e.target.value)})}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Average Usage per Customer: {averageUsage[0].toLocaleString()} {usageConfig.unitName}</Label>
                      <Slider
                        value={averageUsage}
                        onValueChange={setAverageUsage}
                        max={20000}
                        min={500}
                        step={500}
                        className="w-full"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Revenue Metrics */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrency(revenueData.mrr)}
                  </div>
                  <div className="text-sm text-green-600">Monthly Recurring Revenue</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">
                    {formatCurrency(revenueData.arr)}
                  </div>
                  <div className="text-sm text-blue-600">Annual Recurring Revenue</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Churn Impact:</div>
                  <div className="font-medium text-red-600">
                    -{formatCurrency(revenueData.mrr * (churnRate[0] / 100))}
                  </div>
                  
                  <div className="text-gray-600">Growth Potential:</div>
                  <div className="font-medium text-green-600">
                    +{formatCurrency(revenueData.mrr * (growthRate[0] / 100))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Breakdown */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedModel === 'freemium' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Free Users</span>
                      <Badge variant="secondary">{(revenueData as any).freeUsers?.toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pro Users</span>
                      <Badge variant="default">{(revenueData as any).proUsers?.toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Enterprise Users</span>
                      <Badge variant="default">{(revenueData as any).enterpriseUsers?.toLocaleString()}</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center font-medium">
                      <span>Total Paid Users</span>
                      <Badge>{(revenueData as any).totalPaidUsers?.toLocaleString()}</Badge>
                    </div>
                  </div>
                )}

                {selectedModel === 'tiered' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Starter</span>
                      <Badge variant="secondary">{(revenueData as any).starterUsers?.toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Professional</span>
                      <Badge variant="default">{(revenueData as any).professionalUsers?.toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Enterprise</span>
                      <Badge variant="default">{(revenueData as any).enterpriseUsers?.toLocaleString()}</Badge>
                    </div>
                  </div>
                )}

                {selectedModel === 'usage-based' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Customers</span>
                      <Badge>{(revenueData as any).totalCustomers?.toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Avg. Usage</span>
                      <Badge variant="secondary">{(revenueData as any).averageUsage?.toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Base Revenue</span>
                      <Badge variant="outline">{formatCurrency((revenueData as any).baseRevenue)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Overage Revenue</span>
                      <Badge variant="outline">{formatCurrency((revenueData as any).overageRevenue)}</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-medium text-blue-800">Revenue per Customer</div>
                  <div className="text-blue-600">
                    {formatCurrency(revenueData.mrr / customerCount[0])} per month
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="font-medium text-purple-800">Customer Lifetime Value</div>
                  <div className="text-purple-600">
                    {formatCurrency((revenueData.mrr / customerCount[0]) * (1 / (churnRate[0] / 100)))}
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-medium text-green-800">Break-even Point</div>
                  <div className="text-green-600">
                    ~{Math.ceil(50000 / (revenueData.mrr / customerCount[0]))} customers
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}