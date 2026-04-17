'use server';

import { prisma } from '@/lib/prisma';
import { 
    studentSchema, 
    StudentInput, 
    staffSchema, 
    StaffInput,
    StudentStatusEnum 
} from '@/lib/validations/erp';
import { revalidatePath } from 'next/cache';

/**
 * SIS: Student Management Logic
 */
export async function upsertStudent(data: StudentInput & { id?: string }) {
    const validated = studentSchema.parse(data);
    
    try {
        if (data.id) {
            await prisma.student.update({
                where: { id: data.id },
                data: validated
            });
        } else {
            await prisma.student.create({
                data: validated
            });
        }
        revalidatePath('/admin/erp/school/students');
        return { success: true };
    } catch (_error) {
        console.error('Student Upsert Error:', _error);
        return { success: false, error: 'Database operation failed.' };
    }
}

export async function updateStudentStatus(id: string, status: string) {
    const validatedStatus = StudentStatusEnum.parse(status);
    
    try {
        await prisma.student.update({
            where: { id },
            data: { status: validatedStatus }
        });
        revalidatePath('/admin/erp/school/students');
        return { success: true };
    } catch {
        return { success: false, error: 'Failed to update status.' };
    }
}

export async function getAllStudents() {
    return await prisma.student.findMany({
        orderBy: { lastName: 'asc' }
    });
}

/**
 * STAFF: Employee Management Logic
 */
export async function upsertStaff(data: StaffInput & { id?: string }) {
    const validated = staffSchema.parse(data);
    
    try {
        if (data.id) {
            await prisma.staff.update({
                where: { id: data.id },
                data: validated
            });
        } else {
            await prisma.staff.create({
                data: validated
            });
        }
        revalidatePath('/admin/erp/school/staff');
        return { success: true };
    } catch (_error) {
        console.error('Staff Upsert Error:', _error);
        return { success: false, error: 'Database operation failed.' };
    }
}

export async function getAllStaff() {
    return await prisma.staff.findMany({
        orderBy: { name: 'asc' }
    });
}

export async function getSchoolMetrics() {
    const [studentCount, staffCount, teachersCount] = await Promise.all([
        prisma.student.count({ where: { status: 'ACTIVE' } }),
        prisma.staff.count({ where: { isActive: true } }),
        prisma.staff.count({ where: { isActive: true, role: { contains: 'Teacher', mode: 'insensitive' } } })
    ]);

    return {
        activeStudents: studentCount,
        totalStaff: staffCount,
        ratio: teachersCount > 0 ? (studentCount / teachersCount).toFixed(1) : 'N/A'
    };
}
