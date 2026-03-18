from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum
from expenses.models import Expense
from income.models import Income
from budgets.models import Budget
from expenses.serializers import ExpenseSerializer
from datetime import datetime, timedelta
from django.utils import timezone

class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Total Income
        total_income = Income.objects.filter(user=user).aggregate(Sum('amount'))['amount__sum'] or 0
        
        # Total Expenses
        total_expenses = Expense.objects.filter(user=user).aggregate(Sum('amount'))['amount__sum'] or 0
        
        # Remaining Balance
        balance = total_income - total_expenses
        
        # Recent Transactions (last 5)
        recent_expenses = Expense.objects.filter(user=user).order_by('-date')[:5]
        recent_expenses_data = ExpenseSerializer(recent_expenses, many=True).data
        
        # Category breakdown
        category_breakdown = Expense.objects.filter(user=user).values('category').annotate(total=Sum('amount'))
        
        # Budget Progress
        current_month = timezone.now().replace(day=1)
        budget = Budget.objects.filter(user=user, month__year=current_month.year, month__month=current_month.month).first()
        monthly_expense = Expense.objects.filter(user=user, date__year=current_month.year, date__month=current_month.month).aggregate(Sum('amount'))['amount__sum'] or 0
        
        budget_limit = budget.monthly_limit if budget else 0
        budget_usage_percent = (monthly_expense / budget_limit * 100) if budget_limit > 0 else 0

        # --- SMART AI INSIGHT ENGINE ---
        last_week = timezone.now() - timedelta(days=7)
        prev_week = last_week - timedelta(days=7)
        last_week_expense = Expense.objects.filter(user=user, date__gte=last_week).aggregate(Sum('amount'))['amount__sum'] or 0
        prev_week_expense = Expense.objects.filter(user=user, date__gte=prev_week, date__lt=last_week).aggregate(Sum('amount'))['amount__sum'] or 0
        
        income_float = float(total_income)
        insight = "You're doing great! Keep tracking your expenses to see deeper insights."
        
        # 1. Category-specific overspending
        current_month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        category_totals = Expense.objects.filter(user=user, date__gte=current_month_start).values('category').annotate(total=Sum('amount')).order_by('-total')

        if category_totals:
            top_cat = category_totals[0]
            cat_display = top_cat['category']
            # Safely get display name from CATEGORY_CHOICES if it exists
            if hasattr(Expense, 'CATEGORY_CHOICES'):
                cat_display = dict(Expense.CATEGORY_CHOICES).get(top_cat['category'], top_cat['category'])
            
            if income_float > 0 and top_cat['total'] > (income_float * 0.3):
                insight = f"Whoa! Your {cat_display} spending is over 30% of your income. Consider scaling back."
            elif income_float > 0 and top_cat['total'] > (income_float * 0.15):
                insight = f"Your {cat_display} bills are the highest this month. Keep an eye on them."

        # 2. Savings Goal Progress
        try:
            from savings.models import SavingsGoal
            goal = SavingsGoal.objects.filter(user=user).order_by('-target_amount').first()
            if goal and goal.target_amount > 0:
                progress = (goal.current_amount / goal.target_amount) * 100
                if progress > 75 and progress < 100:
                    insight = f"Incredible! You're {progress:.1f}% of the way to your '{goal.name}' goal. Almost there!"
                elif progress > 50:
                    insight = f"Halfway there! You've saved {progress:.1f}% for your '{goal.name}'. Keep up the momentum."
        except Exception as e:
            print(f"Insight Error: {e}")

        # 3. Weekly Trend Fallback
        if "doing great" in insight:
            if last_week_expense > prev_week_expense and prev_week_expense > 0:
                diff_percent = ((last_week_expense - prev_week_expense) / prev_week_expense) * 100
                insight = f"Heads up! Your spending spiked by {diff_percent:.1f}% this week. Ready to rebalance?"
            elif last_week_expense < prev_week_expense:
                insight = "Nice! You spent less this week than last week. Your wallet is happy!"

        return Response({
            'total_income': total_income,
            'total_expenses': total_expenses,
            'balance': balance,
            'recent_transactions': recent_expenses_data,
            'category_breakdown': category_breakdown,
            'budget_status': {
                'limit': budget_limit,
                'used': monthly_expense,
                'usage_percent': budget_usage_percent
            },
            'insight': insight
        })

class MonthlyTrendView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now()
        trend_data = []
        # Get current month + previous 5 months
        for i in range(6):
            # Calculate year and month for the offset
            month_offset = today.month - i
            year = today.year
            month = month_offset
            
            while month <= 0:
                month += 12
                year -= 1
            
            monthly_expenses = Expense.objects.filter(
                user=user, 
                date__year=year, 
                date__month=month
            ).aggregate(Sum('amount'))['amount__sum'] or 0
            
            monthly_income = Income.objects.filter(
                user=user, 
                date__year=year, 
                date__month=month
            ).aggregate(Sum('amount'))['amount__sum'] or 0
            
            # Create a date object for the first of that month for consistent formatting
            m_date = datetime(year, month, 1)
            
            trend_data.append({
                'month': m_date.strftime('%Y-%m-%d'),
                'income': float(monthly_income),
                'expenses': float(monthly_expenses)
            })
        
        # Also include category breakdown for the current month
        category_breakdown = Expense.objects.filter(
            user=user, 
            date__year=today.year, 
            date__month=today.month
        ).values('category').annotate(total=Sum('amount'))
        
        # Map CATEGORY_CHOICES if possible or just return as is
        # For simplicity, we'll return the breakdown in the response
        
        return Response({
            'trends': trend_data[::-1],
            'categories': list(category_breakdown)
        })
