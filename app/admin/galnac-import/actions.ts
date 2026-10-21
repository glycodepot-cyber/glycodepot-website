'use server';
import { requireAdmin } from '@/lib/admin/auth';
import { applyGalnacImport } from '@/lib/admin/galnac-import';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
export async function importGalnacAction(){await requireAdmin();await applyGalnacImport();revalidatePath('/','layout');redirect('/admin/galnac-import');}

export async function updateGalnacScaleCopyAction(){
 await requireAdmin();
 const { applyGalnacScaleCopy } = await import('@/lib/admin/galnac-import');
 await applyGalnacScaleCopy();
 revalidatePath('/','layout');
 redirect('/admin/galnac-import');
}
