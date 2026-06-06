import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DIRECT_URL!
})
const db = new PrismaClient({ adapter })

async function main() {
  const materials = [
    // OS
    {
      subject: 'OS',
      topic: 'What is an Operating System?',
      order: 1,
      content: `An Operating System (OS) is system software that manages computer hardware, software resources, and provides common services for computer programs.

**Types of OS:**
- Batch OS
- Distributed OS  
- Multitasking OS
- Network OS
- Real-Time OS
- Mobile OS

**Main Functions:**
- Process Management
- Memory Management
- File System Management
- Device Management
- Security & Protection`
    },
    {
      subject: 'OS',
      topic: 'Process vs Program vs Thread',
      order: 2,
      content: `**Program:** A set of instructions stored on disk. Static entity. Example: chrome.exe

**Process:** An instance of a program in execution. Dynamic entity. Has its own memory space.

**Thread:** Lightweight process. A path of execution within a process. Shares memory with other threads of same process.

**Key Differences:**
- Program: Passive entity on disk
- Process: Active entity in memory
- Thread: Sub-unit of a process

**Types of Processes:**
- I/O Bound Process
- CPU Bound Process
- Real-time Process
- Interactive Process`
    },
    {
      subject: 'OS',
      topic: 'Deadlock — Conditions & Prevention',
      order: 3,
      content: `**Deadlock:** A situation where processes wait for each other indefinitely — none can proceed.

**4 Necessary Conditions (ALL must hold):**
1. **Mutual Exclusion** — Only one process can use a resource at a time
2. **Hold and Wait** — Process holding resources can request more
3. **No Preemption** — Resources cannot be forcibly taken
4. **Circular Wait** — P1 waits for P2, P2 waits for P1

**Prevention:** Break any one condition:
- Allow resource sharing (break Mutual Exclusion)
- Request all resources at once (break Hold & Wait)
- Allow preemption (break No Preemption)
- Order resource requests (break Circular Wait)

**Banker's Algorithm** — Used for Deadlock Avoidance`
    },
    {
      subject: 'OS',
      topic: 'Virtual Memory & Paging',
      order: 4,
      content: `**Virtual Memory:** Technique that allows execution of processes not completely in memory. Uses disk as extension of RAM.

**Benefits:**
- Programs larger than physical memory can run
- More processes can run simultaneously
- Memory protection between processes

**Paging:** Memory management scheme that eliminates fragmentation.
- Physical memory divided into fixed-size frames
- Logical memory divided into pages of same size
- Page Table maps logical to physical addresses

**Demand Paging:** Pages loaded only when needed (on demand)

**Page Fault:** Occurs when required page is not in memory
- OS must fetch page from disk
- High page faults → Thrashing

**Thrashing:** System spends more time swapping pages than executing processes`
    },
    {
      subject: 'OS',
      topic: 'CPU Scheduling Algorithms',
      order: 5,
      content: `**FCFS (First Come First Serve):**
- Non-preemptive
- Simple but causes convoy effect
- High waiting time for short processes

**SJF (Shortest Job First):**
- Optimal average waiting time
- Preemptive version = SRTF
- Starvation possible for long processes

**Round Robin:**
- Time quantum assigned to each process
- Preemptive, fair
- Best for time-sharing systems

**Priority Scheduling:**
- Each process assigned a priority
- Starvation solution = Aging (increase priority over time)

**Key Terms:**
- Throughput: Processes completed per unit time
- Turnaround Time: Completion - Arrival time
- Waiting Time: Turnaround - Burst time
- Response Time: First response - Arrival time`
    },
    {
      subject: 'OS',
      topic: 'Semaphore & Mutex',
      order: 6,
      content: `**Mutex (Mutual Exclusion):**
- Locking mechanism
- Only the thread that locked it can unlock it
- Used for thread synchronization
- Binary (locked/unlocked)

**Semaphore:**
- Signaling mechanism
- Any thread can signal
- Two types: Binary Semaphore (0/1) and Counting Semaphore

**Differences:**
| Mutex | Semaphore |
|-------|-----------|
| Locking mechanism | Signaling mechanism |
| Owned by thread | Not owned |
| Used in same process | Can be used across processes |

**Producer-Consumer Problem:** Classic synchronization problem solved using semaphores

**Dining Philosophers Problem:** Illustrates deadlock and resource allocation`
    },

    // DBMS
    {
      subject: 'DBMS',
      topic: 'ACID Properties (VERY IMPORTANT)',
      order: 1,
      content: `**ACID = Atomicity, Consistency, Isolation, Durability**

**Atomicity:**
- Transaction is all-or-nothing
- If any part fails, entire transaction rolls back
- Example: Bank transfer — debit AND credit both happen or neither

**Consistency:**
- Database moves from one valid state to another
- All rules, constraints, cascades must be satisfied
- Example: Account balance cannot go negative

**Isolation:**
- Concurrent transactions execute as if sequential
- Intermediate state not visible to other transactions
- Levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable

**Durability:**
- Committed transactions permanently saved
- Survives system failures, crashes
- Achieved through transaction logs

**Why Important in Interviews:**
Almost every product company asks this. Know examples for each property.`
    },
    {
      subject: 'DBMS',
      topic: 'Normalization (1NF, 2NF, 3NF, BCNF)',
      order: 2,
      content: `**Normalization:** Process of organizing data to reduce redundancy and improve integrity.

**1NF (First Normal Form):**
- Each column has atomic (indivisible) values
- No repeating groups
- Each row is unique

**2NF (Second Normal Form):**
- Must be in 1NF
- No partial dependency (non-key attributes depend on FULL primary key)
- Applies only when composite primary key exists

**3NF (Third Normal Form):**
- Must be in 2NF
- No transitive dependency
- Non-key attributes depend ONLY on primary key

**BCNF (Boyce-Codd Normal Form):**
- Stricter version of 3NF
- For every dependency A→B, A must be a super key

**Denormalization:**
- Intentionally adding redundancy for performance
- Used in read-heavy systems, data warehouses`
    },
    {
      subject: 'DBMS',
      topic: 'Keys in DBMS',
      order: 3,
      content: `**Primary Key:**
- Uniquely identifies each record
- Cannot be NULL
- Only one per table

**Foreign Key:**
- References primary key of another table
- Maintains referential integrity
- Can be NULL

**Candidate Key:**
- Minimal set of attributes that uniquely identify a record
- Multiple candidate keys possible
- One becomes primary key

**Super Key:**
- Set of attributes that uniquely identify a record
- Superset of candidate key

**Composite Key:**
- Primary key made of multiple columns
- Together they uniquely identify a record

**Unique Key:**
- Similar to primary key but allows ONE NULL value
- Multiple unique keys per table allowed`
    },
    {
      subject: 'DBMS',
      topic: 'SQL Joins',
      order: 4,
      content: `**INNER JOIN:**
- Returns records that have matching values in both tables
- Most common join

**LEFT JOIN (LEFT OUTER JOIN):**
- Returns ALL records from left table
- Matching records from right table
- NULL if no match in right table

**RIGHT JOIN (RIGHT OUTER JOIN):**
- Returns ALL records from right table
- Matching records from left table

**FULL OUTER JOIN:**
- Returns ALL records when match in either table
- NULL where no match

**CROSS JOIN:**
- Cartesian product of both tables
- Every row of table A joined with every row of table B

**SELF JOIN:**
- Table joined with itself
- Used for hierarchical data

\`\`\`sql
-- Example: Inner Join
SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;
\`\`\``
    },
    {
      subject: 'DBMS',
      topic: 'Indexing & Query Optimization',
      order: 5,
      content: `**Index:** Data structure that improves speed of data retrieval.

**Types of Indexes:**
- **Primary Index:** On primary key, data file is ordered
- **Secondary Index:** On non-primary key fields
- **Clustered Index:** Reorders table data to match index
- **Non-Clustered Index:** Separate structure, pointer to data

**B+ Tree Index (Most Common):**
- Balanced tree structure
- All data in leaf nodes
- Leaf nodes linked — great for range queries

**When to use Index:**
✅ Columns used in WHERE clause frequently
✅ Foreign key columns
✅ Columns used in ORDER BY, GROUP BY
❌ Small tables
❌ Columns with low cardinality
❌ Frequently updated columns

**Query Optimization Tips:**
- Avoid SELECT * — select only needed columns
- Use indexes properly
- Avoid functions on indexed columns in WHERE clause`
    },
    {
      subject: 'DBMS',
      topic: 'Transactions & Concurrency Control',
      order: 6,
      content: `**Transaction:** Unit of work that is atomic.

**Transaction States:**
Active → Partially Committed → Committed
Active → Failed → Aborted

**Concurrency Problems:**
1. **Dirty Read:** Reading uncommitted data
2. **Non-repeatable Read:** Same query gives different results
3. **Phantom Read:** New rows appear between two reads

**Isolation Levels (Low to High):**
1. Read Uncommitted — Dirty reads allowed
2. Read Committed — No dirty reads
3. Repeatable Read — No dirty/non-repeatable reads
4. Serializable — Full isolation, no anomalies

**Locking:**
- **Shared Lock (S):** Multiple reads allowed
- **Exclusive Lock (X):** Only one write allowed
- **Deadlock** can occur with locks

**Two Phase Locking (2PL):**
- Growing phase: Acquire locks
- Shrinking phase: Release locks
- Guarantees serializability`
    },

    // Computer Networks
    {
      subject: 'CN',
      topic: 'OSI Model — 7 Layers',
      order: 1,
      content: `**OSI (Open Systems Interconnection) Model**

**Layer 7 — Application:**
- User interface layer
- HTTP, FTP, SMTP, DNS
- What user interacts with

**Layer 6 — Presentation:**
- Data translation, encryption, compression
- SSL/TLS encryption here
- JPEG, MP4, ASCII

**Layer 5 — Session:**
- Manages sessions between applications
- Authentication, authorization
- NetBIOS, RPC

**Layer 4 — Transport:**
- End-to-end communication
- TCP (reliable) and UDP (unreliable)
- Port numbers here
- Segmentation and reassembly

**Layer 3 — Network:**
- Routing between networks
- IP addresses
- Routers operate here
- IP, ICMP, OSPF

**Layer 2 — Data Link:**
- Node-to-node transfer
- MAC addresses
- Switches, Bridges
- Error detection

**Layer 1 — Physical:**
- Physical transmission of bits
- Cables, Hubs, Signals
- Ethernet, USB

**Mnemonic:** "All People Seem To Need Data Processing"`
    },
    {
      subject: 'CN',
      topic: 'TCP vs UDP',
      order: 2,
      content: `**TCP (Transmission Control Protocol):**
- Connection-oriented (3-way handshake)
- Reliable — guarantees delivery
- In-order delivery
- Flow control and congestion control
- Slower due to overhead
- Used: HTTP, HTTPS, FTP, Email

**UDP (User Datagram Protocol):**
- Connectionless
- Unreliable — no guarantee
- No ordering
- No flow control
- Fast, low latency
- Used: Video streaming, Gaming, DNS, VoIP

**3-Way Handshake (TCP):**
1. SYN — Client sends synchronize
2. SYN-ACK — Server acknowledges
3. ACK — Client acknowledges

**4-Way Termination:**
1. FIN from client
2. ACK from server
3. FIN from server
4. ACK from client

**When to use TCP:** Data integrity critical (banking, file transfer)
**When to use UDP:** Speed critical (live video, gaming)`
    },
    {
      subject: 'CN',
      topic: 'HTTP vs HTTPS & DNS',
      order: 3,
      content: `**HTTP (HyperText Transfer Protocol):**
- Application layer protocol
- Port 80
- Stateless protocol
- No encryption — data sent in plain text

**HTTPS:**
- HTTP + SSL/TLS encryption
- Port 443
- Data encrypted in transit
- Uses certificates for authentication
- Required for all modern websites

**HTTP Methods:**
- GET — Retrieve data
- POST — Send data
- PUT — Update entire resource
- PATCH — Partial update
- DELETE — Remove resource

**HTTP Status Codes:**
- 2xx — Success (200 OK, 201 Created)
- 3xx — Redirection (301 Moved, 304 Not Modified)
- 4xx — Client Error (400 Bad Request, 401 Unauthorized, 404 Not Found)
- 5xx — Server Error (500 Internal Server Error)

**DNS (Domain Name System):**
- Translates domain names to IP addresses
- Like phonebook of the internet
- Process: Browser → Local Cache → ISP DNS → Root DNS → TLD DNS → Authoritative DNS`
    },
    {
      subject: 'CN',
      topic: 'What happens when you type google.com?',
      order: 4,
      content: `**Most Famous Interview Question!**

**Step 1: Browser Cache**
- Check if IP already cached locally

**Step 2: DNS Resolution**
- Check hosts file, local DNS cache
- Query ISP's DNS resolver
- Root nameserver → .com TLD server → Google's nameserver
- Get IP address: 142.250.x.x

**Step 3: TCP Connection**
- 3-way handshake with Google's server
- SYN → SYN-ACK → ACK

**Step 4: TLS Handshake (HTTPS)**
- SSL certificate exchange
- Encryption keys established
- Secure channel created

**Step 5: HTTP Request**
- GET / HTTP/1.1
- Host: www.google.com
- Browser sends request

**Step 6: Server Response**
- Google's load balancer receives request
- Routes to appropriate server
- Server returns HTML, CSS, JS

**Step 7: Browser Rendering**
- Parse HTML → DOM tree
- Parse CSS → CSSOM
- JavaScript execution
- Page rendered on screen`
    },
    {
      subject: 'CN',
      topic: 'IP Addressing & Subnetting',
      order: 5,
      content: `**IP Address:** Unique identifier for device on network

**IPv4:**
- 32-bit address
- Format: xxx.xxx.xxx.xxx
- ~4.3 billion addresses
- Example: 192.168.1.1

**IPv6:**
- 128-bit address
- Format: xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx
- Virtually unlimited addresses
- Solves IPv4 exhaustion

**Classes of IP (IPv4):**
- Class A: 1.0.0.0 — 126.255.255.255 (Large networks)
- Class B: 128.0.0.0 — 191.255.255.255 (Medium networks)
- Class C: 192.0.0.0 — 223.255.255.255 (Small networks)

**Private IP Ranges:**
- 10.0.0.0/8
- 172.16.0.0/12
- 192.168.0.0/16

**Subnet Mask:**
- Divides IP into network and host portions
- 255.255.255.0 = /24 = 254 hosts

**NAT (Network Address Translation):**
- Maps private IPs to public IP
- Allows multiple devices to share one public IP`
    },
    {
      subject: 'CN',
      topic: 'Load Balancer, CDN & Caching',
      order: 6,
      content: `**Load Balancer:**
- Distributes incoming traffic across multiple servers
- Prevents single server overload
- Types: Round Robin, Least Connections, IP Hash

**Algorithms:**
- Round Robin: Requests distributed sequentially
- Least Connections: Sent to server with fewest connections
- Weighted: Servers with more capacity get more requests

**CDN (Content Delivery Network):**
- Servers distributed globally
- Serves content from nearest server
- Reduces latency, improves performance
- Examples: Cloudflare, Akamai, AWS CloudFront

**Caching:**
- Store frequently accessed data temporarily
- Types:
  - Browser Cache
  - CDN Cache
  - Application Cache (Redis, Memcached)
  - Database Cache

**Cache Invalidation Strategies:**
- TTL (Time To Live): Auto-expire after time
- Write-Through: Update cache when DB updated
- Write-Back: Update cache first, DB later
- Cache-Aside: Application manages cache

**Redis vs Memcached:**
- Redis: Persistent, more data types, pub/sub
- Memcached: Simpler, pure caching only`
    },
  ]

  for (const material of materials) {
    await db.studyMaterial.create({ data: material })
  }

  console.log(`✅ ${materials.length} study materials seeded!`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())