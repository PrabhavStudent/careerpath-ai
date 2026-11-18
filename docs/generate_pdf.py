"""
CareerPath AI - PDF Documentation Generator (Exact 5-Page Balanced Layout)
Creates a beautifully formatted, executive-quality PDF explaining the project,
all 6 search algorithms, all 5 ML models, exact code snippets, and AI metrics
in simple 4th-grade terms. Uses 'Rs.' to guarantee 100% universal font rendering.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.drawString(36, 762, "CareerPath AI — Complete Project, Algorithm & Machine Learning Guide")
            self.setFont("Helvetica", 8)
            self.drawRightString(576, 762, "O*NET 31.0 Powered")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.6)
            self.line(36, 756, 576, 756)
            
        # Footer (All pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.6)
        self.line(36, 34, 576, 34)
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(36, 24, "CareerPath AI — Production Documentation | Indian Rupee (Rs.) Pricing | 6 Graph Search Algos + 5 ML Models")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(576, 24, page_text)
            
        self.restoreState()


def create_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    c_primary = colors.HexColor("#1E3A8A")    # Deep Navy
    c_secondary = colors.HexColor("#2563EB")  # Vivid Blue
    c_dark = colors.HexColor("#0F172A")       # Slate Dark
    c_body = colors.HexColor("#334155")       # Slate Text
    c_card_bg = colors.HexColor("#F8FAFC")    # Card Background
    c_code_bg = colors.HexColor("#0F172A")    # Dark Terminal
    c_code_txt = colors.HexColor("#38BDF8")   # Cyan Monospace

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=19,
        leading=23,
        textColor=c_primary,
        alignment=1,
        spaceAfter=2
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=c_secondary,
        alignment=1,
        spaceAfter=6
    )

    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=c_primary,
        spaceBefore=6,
        spaceAfter=4,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=c_secondary,
        spaceBefore=5,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11,
        textColor=c_body,
        spaceAfter=3
    )

    kid_analogy_style = ParagraphStyle(
        'KidAnalogy',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.2,
        leading=11,
        textColor=colors.HexColor("#1E293B"),
        spaceAfter=2
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11,
        textColor=c_body,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=2
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=6.4,
        leading=7.8,
        textColor=c_code_txt
    )

    table_header = ParagraphStyle(
        'TableHead',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white,
        alignment=1
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.2,
        leading=9.2,
        textColor=c_dark
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.2,
        leading=9.2,
        textColor=c_dark
    )

    story = []

    # =========================================================================
    # PAGE 1: TITLE, PROJECT OVERVIEW & 3-BRAIN ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("CareerPath AI — Complete Project & Algorithm Guide", title_style))
    story.append(Paragraph("<b>Intelligent Career Recommendation & Skill-Path Optimization Platform</b><br/>"
                           "<i>Explained in simple terms with code, architecture, and metrics (like a 4th-grade student!)</i>", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.2, color=c_secondary, spaceBefore=1, spaceAfter=6))

    summary_data = [
        [
            Paragraph("<b>What it Solves:</b> Tells students which career fits their skills, spots missing skills, and draws the shortest, cheapest course roadmap in Rupees (Rs.).", table_cell),
            Paragraph("<b>Data Foundation:</b> Official U.S. O*NET 31.0 database (879 rated occupations, 380 skill/knowledge/interest dimensions).", table_cell)
        ],
        [
            Paragraph("<b>Search AI Engine:</b> 6 Graph Search Algorithms (BFS, DFS, Hill Climbing, Branch & Bound, Dijkstra, A* Search).", table_cell),
            Paragraph("<b>ML Classifiers:</b> 5 Models evaluated on 132 test jobs (SVM: 94.7%, Logistic Reg: 92.4%, Random Forest: 91.7%, KNN: 90.2%, Decision Tree: 63.6%).", table_cell)
        ]
    ]
    t_summary = Table(summary_data, colWidths=[268, 272])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_summary)
    story.append(Spacer(1, 6))

    story.append(Paragraph("1. What Does CareerPath AI Do? (The 4th-Grade Story)", h1_style))
    p1 = ("Imagine entering the world's biggest amusement park: <b>Career World</b>! "
          "Inside, there are <b>879 giant game zones</b> (Astronaut, Doctor, Game Developer, Chef, Robot Engineer). "
          "Every student enters holding a backpack with a few skill badges they already earned (like <i>'I know Python'</i> or <i>'I like Math'</i>). "
          "Students always ask three big questions: "
          "<i>1) Which game zone is best for me?</i> "
          "<i>2) What badges am I missing?</i> "
          "<i>3) How can I earn those badges quickly without spending all my pocket money?</i>")
    story.append(Paragraph(p1, body_style))

    p2 = ("<b>CareerPath AI is your smart robot guide!</b> It does three magical tasks:")
    story.append(Paragraph(p2, body_style))
    story.append(Paragraph("<b>1. Backpack Scan:</b> It checks what skills you have and compares them with 879 real careers in O*NET 31.0.", bullet_style))
    story.append(Paragraph("<b>2. Missing Badge Detector (Skill Gap):</b> It spots exactly what skills you lack to qualify for your target dream job.", bullet_style))
    story.append(Paragraph("<b>3. The Treasure Map (Path Optimization):</b> It connects courses like stepping stones across a river, finding the cheapest (Rs.) and fastest route so you never take an advanced class before learning the basics!", bullet_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph("2. How Does It Work? (The 3 AI Brains)", h1_style))
    brains_data = [
        [Paragraph("AI Brain Component", table_header), Paragraph("Technical Job", table_header), Paragraph("Kid Metaphor (How to Picture It)", table_header)],
        [
            Paragraph("<b>Brain 1:<br/>Occupational Classifier</b><br/>(Machine Learning)", table_cell),
            Paragraph("Predicts which of <b>22 Broad SOC Career Families</b> (Computer Science, Healthcare, Engineering, Arts, etc.) fits your overall profile.", table_cell),
            Paragraph("<b>The Harry Potter Sorting Hat:</b> Listens to your talents and announces: <i>'You belong in the Computer & Technology family!'</i>", table_cell)
        ],
        [
            Paragraph("<b>Brain 2:<br/>Vector Skill Matcher</b><br/>(Cosine Similarity)", table_cell),
            Paragraph("Calculates exact 0% to 100% compatibility across all <b>879 individual jobs</b> using normalized dot-product vector math.", table_cell),
            Paragraph("<b>Two Flashlights in the Dark:</b> One flashlight points at what you know; the other points at what the job needs. If both shine in the same direction, it's a 100% match!", table_cell)
        ],
        [
            Paragraph("<b>Brain 3:<br/>Pathfinder Search Engine</b><br/>(Graph Search Algorithms)", table_cell),
            Paragraph("Navigates prerequisite course rules using 6 algorithms to discover the optimal learning path with duration and rupee cost.", table_cell),
            Paragraph("<b>Google Maps for Learning:</b> Prevents you from taking <i>Machine Learning</i> before <i>Python</i>, guiding you safely across the stepping stones!", table_cell)
        ]
    ]
    t_brains = Table(brains_data, colWidths=[115, 210, 215])
    t_brains.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('BACKGROUND', (0,1), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_secondary),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_brains)

    # =========================================================================
    # PAGE 2: GRAPH SEARCH ALGORITHMS 1, 2, AND 3 (BFS, DFS, HILL CLIMBING)
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("3. The 6 AI Search Algorithms (Part 1: BFS, DFS & Hill Climbing)", h1_style))
    p_graph = ("In our code (<code>backend/app/services/search_algorithms.py</code>), academic skills are connected "
               "in a <b>Directed Acyclic Graph (DAG)</b>. Circles (Nodes) are skills; Arrows (Edges) are prerequisites. "
               "Every bridge has an educational effort toll and every course has a fee in Rupees (Rs.).")
    story.append(Paragraph(p_graph, body_style))
    story.append(Spacer(1, 3))

    # --- 1. BFS ---
    story.append(Paragraph("Algorithm #1: Breadth-First Search (BFS)", h2_style))
    story.append(Paragraph("<b>4th-Grade Analogy:</b> <i>The Pebble in the Pond.</i> Ripples expand in circles: Ring 1 first, then Ring 2, then Ring 3. BFS checks all courses 1 step away, then all courses 2 steps away. It never skips a layer!", kid_analogy_style))
    story.append(Paragraph("<b>How It Works:</b> Uses a <b>Queue (First-In, First-Out, like a lunch line)</b>. Explores breadth before depth. <b>Guaranteed to find the path with the fewest course hops!</b>", body_style))
    
    bfs_code = (
        "# Real Code from backend/app/services/search_algorithms.py\n"
        "def run_bfs(self, start='python', goal='data_scientist'):\n"
        "    queue = [[start]]          # First-In, First-Out queue\n"
        "    visited = set([start])     # Avoid revisiting completed nodes\n"
        "    while queue:\n"
        "        path = queue.pop(0)    # Dequeue oldest path\n"
        "        current = path[-1]\n"
        "        if current == goal:\n"
        "            return {'path': path, 'optimality': 'Optimal for minimum hops'}\n"
        "        for neighbor in self.graph.neighbors(current):\n"
        "            if neighbor not in visited:\n"
        "                visited.add(neighbor)\n"
        "                queue.append(path + [neighbor])"
    )
    t_code1 = Table([[Paragraph(f"<font color='#38BDF8'>{bfs_code.replace(chr(10), '<br/>').replace(' ', '&nbsp;')}</font>", code_style)]], colWidths=[540])
    t_code1.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), c_code_bg), ('LEFTPADDING', (0,0), (-1,-1), 5), ('RIGHTPADDING', (0,0), (-1,-1), 5), ('TOPPADDING', (0,0), (-1,-1), 3), ('BOTTOMPADDING', (0,0), (-1,-1), 3)]))
    story.append(t_code1)
    story.append(Spacer(1, 5))

    # --- 2. DFS ---
    story.append(Paragraph("Algorithm #2: Depth-First Search (DFS)", h2_style))
    story.append(Paragraph("<b>4th-Grade Analogy:</b> <i>The Cave Explorer.</i> You walk into a dark cave, pick the left tunnel, and run as deep as you can until hitting a wall. Then you take 1 step back. DFS rushes deep down one road before ever checking neighboring paths!", kid_analogy_style))
    story.append(Paragraph("<b>How It Works:</b> Uses a <b>Stack (Last-In, First-Out, like a stack of plates)</b>. Takes very little memory, but has <b>No Optimality Guarantee</b>: it might take you on a crazy 10-course path when a 2-course path was right next to you!", body_style))
    
    dfs_code = (
        "# Real Code from backend/app/services/search_algorithms.py\n"
        "def run_dfs(self, start='python', goal='data_scientist'):\n"
        "    stack = [[start]]          # Last-In, First-Out stack\n"
        "    visited = set()\n"
        "    while stack:\n"
        "        path = stack.pop()     # Pop the newest path\n"
        "        current = path[-1]\n"
        "        if current not in visited:\n"
        "            visited.add(current)\n"
        "            if current == goal:\n"
        "                return {'path': path, 'optimality': 'No guarantee (arbitrary deep branch)'}\n"
        "            for neighbor in reversed(list(self.graph.neighbors(current))):\n"
        "                if neighbor not in visited:\n"
        "                    stack.append(path + [neighbor])"
    )
    t_code2 = Table([[Paragraph(f"<font color='#38BDF8'>{dfs_code.replace(chr(10), '<br/>').replace(' ', '&nbsp;')}</font>", code_style)]], colWidths=[540])
    t_code2.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), c_code_bg), ('LEFTPADDING', (0,0), (-1,-1), 5), ('RIGHTPADDING', (0,0), (-1,-1), 5), ('TOPPADDING', (0,0), (-1,-1), 3), ('BOTTOMPADDING', (0,0), (-1,-1), 3)]))
    story.append(t_code2)
    story.append(Spacer(1, 5))

    # --- 3. Hill Climbing ---
    story.append(Paragraph("Algorithm #3: Hill Climbing (Greedy Local Search)", h2_style))
    story.append(Paragraph("<b>4th-Grade Analogy:</b> <i>The Blindfolded Hiker in Heavy Fog.</i> You can only feel the ground under your sneakers. You only take a step if it slopes uphill right now. But what if you climb a tiny 4-foot mound and stop, thinking you conquered Mount Everest? That's getting trapped on a 'Local Peak'!", kid_analogy_style))
    story.append(Paragraph("<b>How It Works:</b> Computes a <b>Heuristic h(n)</b> (estimated distance to goal) and greedily picks whichever immediate neighbor has the lowest heuristic. Ultra-fast, but can fail if it hits a dead-end plateau.", body_style))
    
    hc_code = (
        "# Real Code from backend/app/services/search_algorithms.py\n"
        "def run_hill_climbing(self, start='python', goal='data_scientist'):\n"
        "    current = start; path = [current]\n"
        "    while current != goal:\n"
        "        neighbors = list(self.graph.neighbors(current))\n"
        "        scored = sorted([(n, heuristic(n)) for n in neighbors if n not in visited], key=lambda x: x[1])\n"
        "        if not scored or scored[0][1] >= heuristic(current):\n"
        "            break  # Local optimum detected! Trapped on a false peak!\n"
        "        current = scored[0][0]\n"
        "        path.append(current)"
    )
    t_code3 = Table([[Paragraph(f"<font color='#38BDF8'>{hc_code.replace(chr(10), '<br/>').replace(' ', '&nbsp;')}</font>", code_style)]], colWidths=[540])
    t_code3.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), c_code_bg), ('LEFTPADDING', (0,0), (-1,-1), 5), ('RIGHTPADDING', (0,0), (-1,-1), 5), ('TOPPADDING', (0,0), (-1,-1), 3), ('BOTTOMPADDING', (0,0), (-1,-1), 3)]))
    story.append(t_code3)

    # =========================================================================
    # PAGE 3: GRAPH SEARCH ALGORITHMS 4, 5, 6 + COMPARISON TABLE (COMPACT FIT)
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("3. The 6 AI Search Algorithms (Part 2: Branch & Bound, Dijkstra, A*)", h1_style))

    # --- 4. Branch and Bound ---
    story.append(Paragraph("Algorithm #4: Branch and Bound (Budget-Constrained Search)", h2_style))
    story.append(Paragraph("<b>4th-Grade Analogy:</b> <i>The Smart Toy Shopper.</i> You have Rs. 600 in your piggy bank. As you walk through aisles, the moment your cart hits Rs. 610, you instantly drop that path and walk away! You 'prune' (cut off) expensive branches before wasting any more time.", kid_analogy_style))
    story.append(Paragraph("<b>How It Works:</b> Maintains a <b>Priority Queue ordered by cumulative money spent</b>. If a partial path exceeds budget or costs more than the best complete roadmap found so far, it prunes it. Guaranteed cheapest path within budget!", body_style))
    
    bnb_code = (
        "# Real Code from backend/app/services/search_algorithms.py\n"
        "def run_branch_and_bound(self, start='python', goal='data_scientist', budget=600.0):\n"
        "    pq = [(0.0, [start])]; best_cost = float('inf')\n"
        "    while pq:\n"
        "        cost, path = heapq.heappop(pq)  # Pick cheapest candidate\n"
        "        current = path[-1]\n"
        "        if current == goal and cost <= budget:\n"
        "            best_cost, best_path = cost, path; break\n"
        "        for neighbor in self.graph.neighbors(current):\n"
        "            new_cost = cost + edge_weight + node_cost\n"
        "            if new_cost <= budget and new_cost < best_cost:\n"
        "                heapq.heappush(pq, (new_cost, path + [neighbor])) # Prune everything else!"
    )
    t_code4 = Table([[Paragraph(f"<font color='#38BDF8'>{bnb_code.replace(chr(10), '<br/>').replace(' ', '&nbsp;')}</font>", code_style)]], colWidths=[540])
    t_code4.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), c_code_bg), ('LEFTPADDING', (0,0), (-1,-1), 4), ('RIGHTPADDING', (0,0), (-1,-1), 4), ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2)]))
    story.append(t_code4)
    story.append(Spacer(1, 3))

    # --- 5. Dijkstra ---
    story.append(Paragraph("Algorithm #5: Dijkstra's Algorithm (Cheapest Path Finder)", h2_style))
    story.append(Paragraph("<b>4th-Grade Analogy:</b> <i>The Highway Toll Inspector.</i> Some highways have Rs. 100 tolls; back roads only cost Rs. 10. Dijkstra's algorithm checks every turn and always explores the road that keeps the total wallet cost lowest. It never rushes.", kid_analogy_style))
    story.append(Paragraph("<b>How It Works:</b> Starts with Python (distance = 0) and sets all other skills to 'Infinity'. It repeatedly relaxes edge distances. <b>Provably Mathematically Optimal</b> for finding the absolute lowest total cost roadmap!", body_style))
    
    dijk_code = (
        "# Real Code from backend/app/services/search_algorithms.py\n"
        "def run_dijkstra(self, start='python', goal='data_scientist'):\n"
        "    distances = {node: float('inf') for node in self.graph.nodes}; distances[start] = 0.0\n"
        "    pq = [(0.0, start, [start])]\n"
        "    while pq:\n"
        "        curr_dist, current, path = heapq.heappop(pq)\n"
        "        if current == goal: return {'path': path, 'total_cost': curr_dist}\n"
        "        for neighbor in self.graph.neighbors(current):\n"
        "            new_dist = curr_dist + edge_weight\n"
        "            if new_dist < distances[neighbor]:\n"
        "                distances[neighbor] = new_dist  # Relaxation step!\n"
        "                heapq.heappush(pq, (new_dist, neighbor, path + [neighbor]))"
    )
    t_code5 = Table([[Paragraph(f"<font color='#38BDF8'>{dijk_code.replace(chr(10), '<br/>').replace(' ', '&nbsp;')}</font>", code_style)]], colWidths=[540])
    t_code5.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), c_code_bg), ('LEFTPADDING', (0,0), (-1,-1), 4), ('RIGHTPADDING', (0,0), (-1,-1), 4), ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2)]))
    story.append(t_code5)
    story.append(Spacer(1, 3))

    # --- 6. A* Search ---
    story.append(Paragraph("Algorithm #6: A* Search (The Superhero GPS!)", h2_style))
    story.append(Paragraph("<b>4th-Grade Analogy:</b> <i>Google Maps with a Magic Compass.</i> Dijkstra only looks backward ($g(n)$). Hill Climbing only guesses forward ($h(n)$). <b>A* combines both superpowers: f(n) = g(n) + h(n)!</b> It knows how much you spent and has a compass pointing directly at the goal.", kid_analogy_style))
    story.append(Paragraph("<b>How It Works:</b> Because our heuristic underestimates remaining steps (admissible), A* explores fewer nodes than Dijkstra while <b>guaranteeing the exact same provably lowest cost!</b> The gold standard in robotics and games.", body_style))
    
    astar_code = (
        "# Real Code from backend/app/services/search_algorithms.py\n"
        "def run_astar(self, start='python', goal='data_scientist'):\n"
        "    pq = [(heuristic(start), 0.0, start, [start])]\n"
        "    g_scores = {node: float('inf') for node in self.graph.nodes}; g_scores[start] = 0.0\n"
        "    while pq:\n"
        "        f, g, current, path = heapq.heappop(pq)\n"
        "        if current == goal: return {'path': path, 'total_cost': g}\n"
        "        for neighbor in self.graph.neighbors(current):\n"
        "            tentative_g = g + edge_weight\n"
        "            if tentative_g < g_scores[neighbor]:\n"
        "                g_scores[neighbor] = tentative_g\n"
        "                heapq.heappush(pq, (tentative_g + heuristic(neighbor), tentative_g, neighbor, path + [neighbor]))"
    )
    t_code6 = Table([[Paragraph(f"<font color='#38BDF8'>{astar_code.replace(chr(10), '<br/>').replace(' ', '&nbsp;')}</font>", code_style)]], colWidths=[540])
    t_code6.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), c_code_bg), ('LEFTPADDING', (0,0), (-1,-1), 4), ('RIGHTPADDING', (0,0), (-1,-1), 4), ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2)]))
    story.append(t_code6)
    story.append(Spacer(1, 4))

    # Search Algorithm Master Comparison Table
    comp_data = [
        [Paragraph("Algorithm", table_header), Paragraph("Type", table_header), Paragraph("Optimality Guarantee", table_header), Paragraph("Speed", table_header), Paragraph("Best Used For...", table_header)],
        [Paragraph("<b>BFS</b>", table_cell), Paragraph("Uninformed (Queue)", table_cell), Paragraph("YES (Fewest course hops)", table_cell), Paragraph("Fast", table_cell), Paragraph("Finding shortest course count", table_cell)],
        [Paragraph("<b>DFS</b>", table_cell), Paragraph("Uninformed (Stack)", table_cell), Paragraph("NO (Explores arbitrary branch)", table_cell), Paragraph("Fast/Erratic", table_cell), Paragraph("Exploring deep specialized branches", table_cell)],
        [Paragraph("<b>Hill Climbing</b>", table_cell), Paragraph("Informed (Greedy)", table_cell), Paragraph("NO (Can get stuck on hills)", table_cell), Paragraph("Instant", table_cell), Paragraph("Fast heuristic estimate", table_cell)],
        [Paragraph("<b>Branch & Bound</b>", table_cell), Paragraph("Pruned Search", table_cell), Paragraph("YES (Within budget limit)", table_cell), Paragraph("Fast (Pruned)", table_cell), Paragraph("Strict student wallet budgets", table_cell)],
        [Paragraph("<b>Dijkstra</b>", table_cell), Paragraph("Uniform Cost", table_cell), Paragraph("YES (Absolute lowest cost)", table_cell), Paragraph("Moderate", table_cell), Paragraph("Finding guaranteed cheapest path", table_cell)],
        [Paragraph("<b>A* Search</b>", table_cell), Paragraph("Informed (g + h)", table_cell), Paragraph("YES (Cost-optimal & complete)", table_cell), Paragraph("Very Fast", table_cell), Paragraph("Best overall production pathfinder", table_cell)]
    ]
    t_comp = Table(comp_data, colWidths=[80, 95, 125, 65, 175])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('BACKGROUND', (0,1), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_primary),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_comp)

    # =========================================================================
    # PAGE 4: MACHINE LEARNING MODELS, ACCURACY, F1 SCORES & FUNCTIONING
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("4. The Machine Learning Models (Trained on O*NET 31.0)", h1_style))
    p_ml = ("We trained 5 major Machine Learning models on 879 rated occupations across 22 Standard Occupational "
            "Classification (SOC) major groups. Models were evaluated on a held-out test split of 132 occupations. "
            "Here are the exact test results and how each model thinks:")
    story.append(Paragraph(p_ml, body_style))
    story.append(Spacer(1, 4))

    ml_data = [
        [Paragraph("Machine Learning Model", table_header), Paragraph("Test Accuracy", table_header), Paragraph("Macro F1-Score", table_header), Paragraph("Rank & Real-World Verdict", table_header)],
        [
            Paragraph("<b>Support Vector Machine (SVM)</b>", table_cell),
            Paragraph("<b>94.70%</b>", table_cell_bold),
            Paragraph("<b>94.26%</b>", table_cell_bold),
            Paragraph("<font color='#16A34A'><b>#1 Top Accuracy</b> — Superior high-dimensional boundary separation.</font>", table_cell)
        ],
        [
            Paragraph("<b>Logistic Regression</b> (Best Production Classifier)", table_cell),
            Paragraph("<b>92.42%</b>", table_cell_bold),
            Paragraph("<b>89.53%</b>", table_cell_bold),
            Paragraph("<font color='#2563EB'><b>#2 Production Choice</b> — Fast, linear, well-calibrated class probabilities.</font>", table_cell)
        ],
        [
            Paragraph("<b>Random Forest Classifier</b>", table_cell),
            Paragraph("<b>91.67%</b>", table_cell_bold),
            Paragraph("<b>92.64%</b>", table_cell_bold),
            Paragraph("<font color='#0D9488'><b>#3 Ensemble Master</b> — 100 decision trees voting together, avoids overfitting.</font>", table_cell)
        ],
        [
            Paragraph("<b>K-Nearest Neighbors (KNN)</b>", table_cell),
            Paragraph("<b>90.15%</b>", table_cell_bold),
            Paragraph("<b>89.37%</b>", table_cell_bold),
            Paragraph("<font color='#D97706'><b>#4 Strong Baseline</b> — Finds closest historical jobs by distance metric.</font>", table_cell)
        ],
        [
            Paragraph("<b>Decision Tree Classifier</b>", table_cell),
            Paragraph("<b>63.64%</b>", table_cell_bold),
            Paragraph("<b>65.08%</b>", table_cell_bold),
            Paragraph("<font color='#DC2626'><b>#5 Overfitting Risk</b> — Single rule tree struggles with 22 distinct classes.</font>", table_cell)
        ]
    ]
    t_ml_table = Table(ml_data, colWidths=[150, 75, 85, 230])
    t_ml_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('BACKGROUND', (0,1), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_primary),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_ml_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph("How Each Model Thinks (4th-Grade Explanations):", h2_style))

    story.append(Paragraph("<b>1. Support Vector Machine (SVM) — The Wide Sidewalk Builder (94.70%):</b><br/>"
                           "<i>Analogy:</i> Imagine two teams playing dodgeball on a gym floor. SVM doesn't just draw a thin line between them; "
                           "it builds the <b>widest possible safe sidewalk (the maximum margin)</b> so nobody accidentally crosses over! "
                           "Because our O*NET dataset has 380 skill features, SVM uses a mathematical 'kernel trick' to curve boundaries in high-dimensional space.", body_style))

    story.append(Paragraph("<b>2. Logistic Regression — The Wise Probability Teacher (92.42%):</b><br/>"
                           "<i>Analogy:</i> Instead of just shouting a guess, Logistic Regression calculates weighted scores and passes them through a smooth S-curve (the Sigmoid function). "
                           "It gives real probabilities: <i>'There is an 88% chance you belong in Computer Science, and an 8% chance in Engineering.'</i> "
                           "This is saved as our production model: <code>best_occupational_classifier.pkl</code>.", body_style))

    story.append(Paragraph("<b>3. Random Forest — The Council of 100 Tree Friends (91.67%):</b><br/>"
                           "<i>Analogy:</i> If you ask 1 friend for advice, they might be biased. But what if you ask a council of <b>100 friendly trees</b>, "
                           "where every tree asks different questions ('Do you like circuits?', 'Do you like animals?'), and then all 100 take a democratic vote? "
                           "That is Random Forest! It is rugged and rarely tricked by noisy data.", body_style))

    story.append(Paragraph("<b>4. K-Nearest Neighbors (KNN) — Birds of a Feather (90.15%):</b><br/>"
                           "<i>Analogy:</i> If a new kid joins school and you want to know what game they like, look at the <b>5 closest kids standing next to them</b>! "
                           "If 4 of them are holding basketballs, the new kid probably likes basketball! KNN calculates Euclidean distance across skill vectors.", body_style))

    story.append(Paragraph("<b>5. Decision Tree — The 20 Questions Game (63.64%):</b><br/>"
                           "<i>Analogy:</i> Just like playing 20 Questions: <i>'Do you like coding? Yes. -> Do you like web? Yes. -> Web Developer.'</i> "
                           "While simple to read, a single decision tree is too rigid and makes brittle mistakes when classifying 22 different industry families.", body_style))

    story.append(Paragraph("<b>6. Vector Cosine Similarity (The Flashlight Matcher in predict.py):</b><br/>"
                           "<i>Analogy:</i> In <code>predict.py</code>, student skills and job requirements become two arrows in 380-dimensional space. "
                           "The formula <b>Cosine Similarity = (A · B) / (||A|| × ||B||)</b> measures the angle between them. "
                           "If both arrows point in the exact same direction, it yields a 100% skill match score!", body_style))

    # =========================================================================
    # PAGE 5: AI METRICS EXPLAINED, REAL WALKTHROUGH & SUMMARY
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("5. AI Metrics Explained Simply (Like You're 10 Years Old!)", h1_style))
    p_met = ("Computer scientists use fancy terms like <i>Precision</i>, <i>Recall</i>, and <i>Macro F1</i>. "
             "Here is what they actually mean in simple, everyday playground language:")
    story.append(Paragraph(p_met, body_style))
    story.append(Spacer(1, 3))

    met_cards = [
        [Paragraph("Metric", table_header), Paragraph("Kid Metaphor & Example", table_header), Paragraph("What It Means for CareerPath AI", table_header)],
        [
            Paragraph("<b>Accuracy</b>", table_cell_bold),
            Paragraph("<b>The Spelling Test:</b> Out of 100 questions on a test, how many did you answer correctly? If you got 92 right, your accuracy is <b>92%</b>!", table_cell),
            Paragraph("Out of 132 test careers, how many did the AI place in the 100% correct industry family?", table_cell)
        ],
        [
            Paragraph("<b>Precision</b>", table_cell_bold),
            Paragraph("<b>The Boy Who Cried Wolf:</b> When the boy yells <i>'WOLF!'</i>, is there really a wolf, or is it a false alarm? High precision means when the AI says <i>'This is a Doctor!'</i>, you can bet it really is one!", table_cell),
            Paragraph("When the AI recommends a career, how sure are we that it's a genuine match and not a false recommendation?", table_cell)
        ],
        [
            Paragraph("<b>Recall</b>", table_cell_bold),
            Paragraph("<b>The Hide-and-Seek Champion:</b> If 10 kids are hiding in the garden, did you find all 10 of them? Or did you miss 3 behind the trees? High recall means the AI never overlooks good careers you qualify for!", table_cell),
            Paragraph("Did the AI find all the relevant careers that match your background without leaving any out?", table_cell)
        ],
        [
            Paragraph("<b>F1-Score</b>", table_cell_bold),
            Paragraph("<b>The Best Friends Score:</b> Precision and Recall are best friends holding hands! If you cheat by guessing 'Doctor' for everyone, recall is high but precision is terrible. F1 rewards having BOTH high!", table_cell),
            Paragraph("Our models score up to <b>94.26% F1</b>, meaning they rarely give false alarms AND rarely miss good jobs.", table_cell)
        ],
        [
            Paragraph("<b>Macro vs. Micro</b>", table_cell_bold),
            Paragraph("<b>Fairness for Small Teams:</b> In our data, there are many Cashier jobs (big class), but few Astronomers (small class). <b>Macro F1</b> gives every career family one equal vote so rare jobs are never bullied by common jobs!", table_cell),
            Paragraph("We report <b>Macro F1</b> to prove our AI is equally brilliant at rare science careers as it is at common office jobs.", table_cell)
        ]
    ]
    t_met_cards = Table(met_cards, colWidths=[80, 230, 230])
    t_met_cards.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_secondary),
        ('BACKGROUND', (0,1), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_secondary),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_met_cards)
    story.append(Spacer(1, 6))

    # Chapter 6: Real Walkthrough
    story.append(Paragraph("6. A Real-Life Example: Student 'Aarav' Becomes a Data Scientist", h1_style))
    story.append(Paragraph("<b>Step 1 — Profile:</b> Aarav inputs what he knows: <i>Python (Level 3/5)</i> and <i>Basic Math (Level 2/5)</i>.", bullet_style))
    story.append(Paragraph("<b>Step 2 — O*NET Classifier:</b> Logistic Regression flags <b>SOC Group 15 (Computer & Mathematical)</b> with 91.2% probability.", bullet_style))
    story.append(Paragraph("<b>Step 3 — Skill Gap Spotting:</b> Vector Matcher compares Aarav against the official 'Data Scientist' profile (O*NET 15-2051.00): Aarav lacks <i>SQL</i>, <i>Data Analysis</i>, and <i>Machine Learning</i>.", bullet_style))
    story.append(Paragraph("<b>Step 4 — Running the Search Engines:</b> All 6 algorithms calculate learning routes simultaneously:", bullet_style))

    walk_data = [
        [Paragraph("Algorithm", table_header), Paragraph("Route Discovered", table_header), Paragraph("Total Cost (Rs.)", table_header), Paragraph("Est. Hours", table_header), Paragraph("Verdict", table_header)],
        [Paragraph("<b>BFS</b>", table_cell), Paragraph("Python → Data Analysis → Data Scientist", table_cell), Paragraph("Rs. 80.00", table_cell), Paragraph("85 hrs", table_cell), Paragraph("Shortest hops (2 transitions)", table_cell)],
        [Paragraph("<b>DFS</b>", table_cell), Paragraph("Python → Linux → Cloud → ML → Data Scientist", table_cell), Paragraph("Rs. 450.00", table_cell), Paragraph("235 hrs", table_cell), Paragraph("Wandering scenic route", table_cell)],
        [Paragraph("<b>Dijkstra / A*</b>", table_cell), Paragraph("Python → SQL → Data Analysis → ML → Data Scientist", table_cell), Paragraph("Rs. 280.00", table_cell), Paragraph("175 hrs", table_cell), Paragraph("<b>Guaranteed Cost-Optimal</b>", table_cell)]
    ]
    t_walk = Table(walk_data, colWidths=[80, 225, 75, 55, 105])
    t_walk.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('BACKGROUND', (0,1), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_primary),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_walk)
    story.append(Spacer(1, 4))

    story.append(Paragraph("<b>Step 5 — Dashboard Delivery:</b> The frontend renders an interactive React Flow DAG showing milestones, verified courses in Indian Rupees (Rs. 2,999 - Rs. 7,999), and live job listings (Rs. 8.5L - Rs. 24L / yr).", bullet_style))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceBefore=2, spaceAfter=5))

    concl_p = ("<b>The Entire Project in One Sentence:</b> CareerPath AI is like having a team of 5 genius professors (Machine Learning) "
               "who figure out what you are born to do, and 6 master navigators (Graph Search Algorithms) "
               "who draw you the safest, fastest, and cheapest map to get there!")
    story.append(Paragraph(concl_p, ParagraphStyle('Concl', parent=body_style, fontName='Helvetica-Bold', fontSize=8.5, leading=12, textColor=c_primary)))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF at: {output_path}")

if __name__ == '__main__':
    target = os.path.join(r"C:\Users\DELL\Desktop\AI Project\docs", "CareerPath_AI_Project_and_Algorithms_Guide.pdf")
    create_pdf(target)
