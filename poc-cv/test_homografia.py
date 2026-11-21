"""Testes da homografia (V1). Rodar: python -m unittest test_homografia.py  (precisa só de numpy)."""
import json
import os
import tempfile
import unittest

import numpy as np

import homografia as hg


class TestHomografia(unittest.TestCase):
    def setUp(self):
        # Uma "câmera" inventada: H_real leva metros → pixels (perspectiva de transmissão)
        self.H_cam = np.array([[9.0, 2.2, 120.0], [0.3, 6.5, 80.0], [0.0004, 0.0035, 1.0]])
        self.nomes = ['ga_dir_sup', 'ga_dir_inf', 'ga_dir_linha_inf', 'ga_dir_linha_sup']
        self.campo = [hg.PONTOS_CAMPO[n] for n in self.nomes]
        self.pixels = hg.aplicar(self.H_cam, self.campo)

    def test_recupera_pontos_de_calibracao(self):
        H = hg.calcular_homografia(self.pixels, self.campo)
        self.assertLess(hg.erro_reprojecao(H, self.pixels, self.campo), 1e-6)

    def test_projeta_outros_pontos_do_campo(self):
        H = hg.calcular_homografia(self.pixels, self.campo)
        rng = np.random.default_rng(7)
        reais = np.column_stack([rng.uniform(0, 105, 50), rng.uniform(0, 68, 50)])
        px = hg.aplicar(self.H_cam, reais)
        est = hg.imagem_para_campo(H, px)
        self.assertLess(np.max(np.abs(est - reais)), 1e-6)

    def test_ida_e_volta(self):
        H = hg.calcular_homografia(self.pixels, self.campo)
        m = np.array([[52.5, 34.0], [11.0, 34.0]])
        self.assertTrue(np.allclose(hg.imagem_para_campo(H, hg.campo_para_imagem(H, m)), m))

    def test_erro_de_clique_pequeno_gera_erro_pequeno(self):
        ruido = np.array([[1.5, -1.0], [-2.0, 1.0], [1.0, 2.0], [-1.0, -1.5]])  # cliques ~2 px fora
        H = hg.calcular_homografia(self.pixels + ruido, self.campo)
        est = hg.imagem_para_campo(H, hg.aplicar(self.H_cam, [[90.0, 34.0]]))[0]
        self.assertLess(np.linalg.norm(est - [90.0, 34.0]), 1.0)  # menos de 1 m perto da área calibrada

    def test_pontos_colineares_sao_recusados(self):
        with self.assertRaises(ValueError):
            hg.calcular_homografia([[0, 0], [1, 1], [2, 2], [3, 3]], [[0, 0], [1, 1], [2, 2], [3, 3]])

    def test_pe_do_jogador_e_dentro_do_campo(self):
        self.assertEqual(hg.pe_do_jogador(10, 20, 30, 80), (20.0, 80))
        self.assertTrue(hg.dentro_do_campo(50, 30))
        self.assertFalse(hg.dentro_do_campo(130, 30))

    def test_salvar_e_carregar(self):
        H = hg.calcular_homografia(self.pixels, self.campo)
        with tempfile.TemporaryDirectory() as d:
            arq = os.path.join(d, 'calib.json')
            dados = hg.salvar_calibracao(arq, self.pixels, self.nomes, H, quadro=0, video='clip.mp4')
            H2, lido = hg.carregar_calibracao(arq)
            self.assertTrue(np.allclose(H, H2))
            self.assertEqual(lido['nomes'], self.nomes)
            self.assertLess(dados['erro_medio_m'], 1e-6)
            json.dumps(lido)


if __name__ == '__main__':
    unittest.main()
