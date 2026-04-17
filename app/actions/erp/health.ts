'use server';

import { prisma } from '@/lib/prisma';
import { 
    nutritionalLogSchema, 
    NutritionalLogInput, 
    healthRecordSchema, 
    HealthRecordInput 
} from '@/lib/validations/erp';
import { revalidatePath } from 'next/cache';

/**
 * NUTRITION: Daily Feeding Log Logic
 */
export async function logDailyMeal(data: NutritionalLogInput) {
    const validated = nutritionalLogSchema.parse(data);
    
    try {
        await prisma.nutritionalLog.create({
            data: validated
        });
        revalidatePath('/admin/erp/school/nutrition');
        revalidatePath('/admin/erp'); // Dashboard metrics
        return { success: true };
    } catch (error) {
        console.error('Nutrition Log Error:', error);
        return { success: false, error: 'Failed to record feeding event.' };
    }
}

/**
 * HEALTH: Student Health Metrics Logic
 */
export async function recordStudentVitals(data: HealthRecordInput) {
    const validated = healthRecordSchema.parse(data);
    
    // Calculate BMI if not provided
    // BMI = weight (kg) / (height (m) * height (m))
    let bmi = validated.bmi;
    if (!bmi && validated.height > 0) {
        const heightInMeters = Number(validated.height) / 100;
        bmi = Number(validated.weight) / (heightInMeters * heightInMeters);
    }

    try {
        await prisma.healthRecord.create({
            data: {
                ...validated,
                bmi: bmi
            }
        });
        revalidatePath(`/admin/erp/school/students/${validated.studentId}/health`);
        return { success: true };
    } catch (error) {
        console.error('Health Record Error:', error);
        return { success: false, error: 'Failed to record health vitals.' };
    }
}

export async function getStudentHealthHistory(studentId: string) {
    return await prisma.healthRecord.findMany({
        where: { studentId },
        orderBy: { date: 'asc' }
    });
}

/**
 * METRICS: Impact Aggregation
 */
export async function getSchoolNutritionStats() {
    const totalMeals = await prisma.nutritionalLog.aggregate({
        _sum: { studentCount: true }
    });

    return {
        totalMealsServed: totalMeals._sum.studentCount || 0
    };
}
