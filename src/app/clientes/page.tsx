import Link from "next/link";
import { fetchClientes } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ClientesPage() {
  const clientes = await fetchClientes();

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <header className="border-b bg-[#fd6c13] px-4 py-4 text-white shadow-sm md:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:underline">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-xl font-bold md:text-2xl">RidePromo</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Clientes (com login)</h2>
          <Card>
            <CardHeader>
              <CardTitle>Usuários</CardTitle>
              <CardDescription>Usuários que fizeram ao menos uma viagem com login no app.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden sm:table-cell">Telefone</TableHead>
                    <TableHead className="hidden md:table-cell">E-mail</TableHead>
                    <TableHead className="w-[100px]">WhatsApp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        Nenhum cliente com login encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    clientes.map((c) => (
                      <TableRow key={c.id_user}>
                        <TableCell className="font-medium">{c.name_user?.trim() || "—"}</TableCell>
                        <TableCell className="hidden sm:table-cell">{c.phone?.trim() || "—"}</TableCell>
                        <TableCell className="hidden max-w-[200px] truncate md:table-cell" title={c.email ?? ""}>
                          {c.email?.trim() || "—"}
                        </TableCell>
                        <TableCell>
                          {c.phone?.trim() ? (
                            <Button variant="whatsapp" size="sm" asChild>
                              <a href={whatsappUrl(c.phone!)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                <MessageCircle className="h-4 w-4" />
                                <span className="hidden sm:inline">Zap</span>
                              </a>
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
