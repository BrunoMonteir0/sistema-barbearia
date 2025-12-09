// export default function StepTelefone({ telefone, setTelefone, nextStep }: any) {
//   function formatar(v: string) {
//     return v
//       .replace(/\D/g, "")
//       .replace(/^(\d{2})(\d)/, "($1) $2")
//       .replace(/(\d{5})(\d)/, "$1-$2")
//       .slice(0, 15);
//   }

//   return (
//     <div className="card">
//       <h3 className="text-xl font-semibold text-secondary-500 mb-6">
//         Seu telefone para notificações
//       </h3>

//       <input
//         type="tel"
//         className="input-field"
//         placeholder="(11) 9 9999-9999"
//         value={telefone}
//         onChange={(e) => setTelefone(formatar(e.target.value))}
//       />

//       <div className="flex justify-end mt-6">
//         <button
//           type="button"
//           onClick={nextStep}
//           disabled={telefone.length < 15}
//           className="btn-primary"
//         >
//           Continuar
//         </button>
//       </div>
//     </div>
//   );
// }
