import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function ListaTelefonica() {
  const [contatos, setContatos] = useState([]);
  const [form, setForm] = useState({ nome: "", telefone: "", celular: "", ramal: "", setor: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [usuario, setUsuario] = useState("");
  const [logado, setLogado] = useState(false);
  const [loginInfo, setLoginInfo] = useState({ usuario: "", senha: "" });

  const USUARIO_ADMIN = "nicolasrpaulucci";
  const SENHA_ADMIN = "91623381";

  useEffect(() => {
    const contatosSalvos = localStorage.getItem("contatos");
    if (contatosSalvos) {
      setContatos(JSON.parse(contatosSalvos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("contatos", JSON.stringify(contatos));
  }, [contatos]);

  const formatarTelefoneFixo = (value) => {
    const raw = value.replace(/\D/g, "").slice(0, 10);
    let formatado = raw;
    if (raw.length >= 2) {
      formatado = `(${raw.slice(0, 2)}`;
      if (raw.length >= 6) {
        formatado += `) ${raw.slice(2, 6)}-${raw.slice(6)}`;
      } else if (raw.length > 2) {
        formatado += `) ${raw.slice(2)}`;
      }
    }
    return formatado;
  };

  const formatarCelular = (value) => {
    const raw = value.replace(/\D/g, "").slice(0, 11);
    let formatado = raw;
    if (raw.length >= 2) {
      formatado = `(${raw.slice(0, 2)}`;
      if (raw.length >= 7) {
        formatado += `) ${raw.slice(2, 7)}-${raw.slice(7)}`;
      } else if (raw.length > 2) {
        formatado += `) ${raw.slice(2)}`;
      }
    }
    return formatado;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "telefone") {
      setForm({ ...form, telefone: formatarTelefoneFixo(value) });
    } else if (name === "celular") {
      setForm({ ...form, celular: formatarCelular(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const salvarContato = () => {
    if (editIndex !== null) {
      const novosContatos = [...contatos];
      novosContatos[editIndex] = form;
      setContatos(novosContatos);
    } else {
      setContatos([...contatos, form]);
    }
    setForm({ nome: "", telefone: "", celular: "", ramal: "", setor: "" });
    setEditIndex(null);
    setOpen(false);
  };

  const editarContato = (index) => {
    setForm(contatos[index]);
    setEditIndex(index);
    setOpen(true);
  };

  const excluirContato = (index) => {
    const novosContatos = contatos.filter((_, i) => i !== index);
    setContatos(novosContatos);
  };

  const contatosFiltrados = contatos.filter((contato) =>
    contato.nome.toLowerCase().includes(busca.toLowerCase()) ||
    contato.telefone.toLowerCase().includes(busca.toLowerCase()) ||
    contato.celular.toLowerCase().includes(busca.toLowerCase()) ||
    contato.ramal.toLowerCase().includes(busca.toLowerCase()) ||
    contato.setor.toLowerCase().includes(busca.toLowerCase())
  );

  const isAdmin = logado && usuario === USUARIO_ADMIN;

  const realizarLogin = () => {
    if (loginInfo.usuario === USUARIO_ADMIN && loginInfo.senha === SENHA_ADMIN) {
      setUsuario(loginInfo.usuario);
      setLogado(true);
    } else {
      alert("Usuário ou senha incorretos");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Lista Telefônica</h1>
          {isAdmin ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex gap-2">
                  <Plus className="w-4 h-4" /> Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogTitle className="sr-only">Adicionar ou Editar Contato</DialogTitle>
                <div className="flex flex-col gap-4">
                  <Input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />
                  <Input name="telefone" placeholder="Telefone (44) 3322-1122" value={form.telefone} onChange={handleChange} />
                  <Input name="celular" placeholder="Celular (44) 99987-5644" value={form.celular} onChange={handleChange} />
                  <Input name="ramal" placeholder="Ramal" value={form.ramal} onChange={handleChange} />
                  <Input name="setor" placeholder="Setor" value={form.setor} onChange={handleChange} />
                  <Button onClick={salvarContato}>{editIndex !== null ? "Salvar Alterações" : "Adicionar Contato"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            !logado && (
              <div className="flex gap-2">
                <Input
                  placeholder="Usuário"
                  value={loginInfo.usuario}
                  onChange={(e) => setLoginInfo({ ...loginInfo, usuario: e.target.value })}
                />
                <Input
                  placeholder="Senha"
                  type="password"
                  value={loginInfo.senha}
                  onChange={(e) => setLoginInfo({ ...loginInfo, senha: e.target.value })}
                />
                <Button onClick={realizarLogin}>Entrar</Button>
              </div>
            )
          )}
        </div>

        <div className="mb-6">
          <Input
            placeholder="Pesquisar contatos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contatosFiltrados.map((contato, index) => (
            <Card key={index} className="rounded-2xl shadow-md">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{contato.nome}</h2>
                <p className="text-gray-600">📞 Telefone: {contato.telefone}</p>
                <p className="text-gray-600">📱 Celular: {contato.celular}</p>
                <p className="text-gray-600">📠 Ramal: {contato.ramal}</p>
                <p className="text-gray-600">🏢 Setor: {contato.setor}</p>
                {isAdmin && (
                  <div className="flex justify-end gap-2 mt-4">
                    <Button size="icon" variant="outline" onClick={() => editarContato(index)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => excluirContato(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
