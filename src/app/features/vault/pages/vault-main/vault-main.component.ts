import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface SecretEngine {
  path: string;
  type: string;
  description: string;
  status: 'enabled' | 'disabled';
  version: string;
}

interface Policy {
  name: string;
  description: string;
  rules: number;
  lastModified: string;
}

interface Token {
  id: string;
  displayName: string;
  policies: string[];
  ttl: string;
  renewable: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-vault-main',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule
  ],
  templateUrl: './vault-main.component.html',
  styleUrls: ['./vault-main.component.scss']
})
export class VaultMainComponent implements OnInit {

  vaultStatus = {
    sealed: false,
    version: '1.15.2',
    clusterName: 'vault-cluster-prod',
    nodes: 3,
    activeNode: 'vault-node-1'
  };

  secretEngines: SecretEngine[] = [
    {
      path: 'secret/',
      type: 'kv',
      description: 'Key-Value store for application secrets',
      status: 'enabled',
      version: 'v2'
    },
    {
      path: 'database/',
      type: 'database',
      description: 'Dynamic database credentials',
      status: 'enabled',
      version: 'v1'
    },
    {
      path: 'aws/',
      type: 'aws',
      description: 'AWS IAM credentials',
      status: 'enabled',
      version: 'v1'
    },
    {
      path: 'kubernetes/',
      type: 'kubernetes',
      description: 'Kubernetes service account tokens',
      status: 'enabled',
      version: 'v1'
    },
    {
      path: 'pki/',
      type: 'pki',
      description: 'Public Key Infrastructure',
      status: 'disabled',
      version: 'v1'
    }
  ];

  policies: Policy[] = [
    {
      name: 'admin-policy',
      description: 'Full administrative access',
      rules: 15,
      lastModified: '2 days ago'
    },
    {
      name: 'dev-policy',
      description: 'Development environment access',
      rules: 8,
      lastModified: '1 week ago'
    },
    {
      name: 'prod-policy',
      description: 'Production read-only access',
      rules: 5,
      lastModified: '3 days ago'
    },
    {
      name: 'read-only',
      description: 'Read-only access to secrets',
      rules: 3,
      lastModified: '1 day ago'
    }
  ];

  recentTokens: Token[] = [
    {
      id: 'hvs.CAESI...truncated',
      displayName: 'api-service-token',
      policies: ['prod-policy', 'read-only'],
      ttl: '24h',
      renewable: true,
      createdAt: '2 hours ago'
    },
    {
      id: 'hvs.CAESI...truncated',
      displayName: 'dev-team-token',
      policies: ['dev-policy'],
      ttl: '8h',
      renewable: false,
      createdAt: '1 day ago'
    }
  ];

  vaultUrl = 'http://vault.company.local:8200';
  selectedTab = 'overview'; // 'overview' | 'engines' | 'policies' | 'tokens'

  constructor() { }

  ngOnInit(): void {
  }

  openVaultUI(): void {
    window.open(this.vaultUrl, '_blank');
  }

  refreshVaultStatus(): void {
    console.log('Refreshing Vault status...');
    // Aquí implementarías la lógica para refrescar el estado de Vault
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  getEnabledEnginesCount(): number {
    return this.secretEngines.filter(e => e.status === 'enabled').length;
  }

  toggleEngine(enginePath: string): void {
    const engine = this.secretEngines.find(e => e.path === enginePath);
    if (engine) {
      engine.status = engine.status === 'enabled' ? 'disabled' : 'enabled';
    }
  }

  editPolicy(policyName: string): void {
    console.log('Editing policy:', policyName);
    // Implementar navegación a edición de políticas
  }

  revokeToken(tokenId: string): void {
    console.log('Revoking token:', tokenId);
    // Implementar revocación de token
  }
}