const data = {
  "limit": 2,
  "links": {
    "first": "https://alpha-6.fabric-testbed.net/announcements?announcement_type=news&is_active=True&offset=0&limit=2",
    "last": "https://alpha-6.fabric-testbed.net/announcements?announcement_type=news&is_active=True&offset=0&limit=2"
  },
  "offset": 0,
  "results": [
    {
      "announcement_type": "news",
      "button": "Read More",
      "content": "Next Generation Internet (NGI) Enrichers is an initiative that supports transatlantic research cooperation in areas related to the next generation of the internet, such as networking, cybersecurity, virtual reality, 5G, machine learning, and several others.",
      "display_date": "2023-04-18 00:00:00+00:00",
      "is_active": true,
      "link": "https://learn.fabric-testbed.net/knowledge-base/ngi-enrichers-program-seeks-host-organizations-for-funded-researchers/",
      "start_date": "2023-04-18 00:00:00+00:00",
      "title": "NGI Enrichers program seeks host organizations for funded researchers",
      "uuid": "61cd0256-8aff-4efb-956a-2619f8974a69"
    },
    {
      "announcement_type": "news",
      "button": "Read More",
      "content": "The NSF-funded FABRIC project has made steady progress establishing the groundbreaking network testbed infrastructure to reimagine the way large amounts of data are generated, stored, analyzed, and transmitted across the world. The team recently announced the completion of Phase 1 of the project, marking the successful installation of all Phase 1 sites after overcoming supply chain delays and other challenges due to COVID-19. With the required hardware, software, storage, and fiber optic connections in place, the FABRIC system is available for early users to build and test novel large-scale experiments.",
      "display_date": "2022-09-16 00:00:00+00:00",
      "is_active": true,
      "link": "https://learn.fabric-testbed.net/knowledge-base/nsf-fabric-project-completes-phase-1-enabling-early-testing-of-unprecedented-large-scale-network-experiments/",
      "start_date": "2022-09-16 00:00:00+00:00",
      "title": "NSF FABRIC Project Completes Phase 1, Enabling Early Testing of Unprecedented Large-scale Network Experiments",
      "uuid": "d37ff875-361f-43d1-b718-084abde4397b"
    }
  ],
  "size": 2,
  "status": 200,
  "total": 2,
  "type": "announcements"
}

export function getMockActiveNews() {
  return data;
}
