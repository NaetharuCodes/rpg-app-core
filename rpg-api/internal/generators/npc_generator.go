package generators

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/naetharu/rpg-api/internal/models"
	"gorm.io/gorm"
)

type NPCGenerator struct {
	DB   *gorm.DB
	rand *rand.Rand
}

type GenerationConfig struct {
	WorldID           uint
	PopulationSize    int
	OrganizationCount int
	FamilyDensity     float64 // 0.0-1.0, how many family relationships to create
	Seed              int64
}

func NewNPCGenerator(db *gorm.DB) *NPCGenerator {
	return &NPCGenerator{
		DB: db,
	}
}

func (g *NPCGenerator) GeneratePopulation(config GenerationConfig) error {
	// Initialize random with seed for reproducible results
	g.rand = rand.New(rand.NewSource(config.Seed))

	// 1. Create basic locations for the world
	if err := g.createLocations(config.WorldID); err != nil {
		return fmt.Errorf("failed to create locations: %w", err)
	}

	// 2. Create organizations with basic rank structures
	if err := g.createOrganizations(config.WorldID, config.OrganizationCount); err != nil {
		return fmt.Errorf("failed to create organizations: %w", err)
	}

	// 3. Generate NPCs
	if err := g.createNPCs(config.WorldID, config.PopulationSize); err != nil {
		return fmt.Errorf("failed to create NPCs: %w", err)
	}

	// 4. Assign NPCs to organizations
	if err := g.assignOrganizationMemberships(config.WorldID); err != nil {
		return fmt.Errorf("failed to assign memberships: %w", err)
	}

	// 5. Create family relationships
	if err := g.createFamilyRelationships(config.WorldID, config.FamilyDensity); err != nil {
		return fmt.Errorf("failed to create relationships: %w", err)
	}

	// 6. Save generation config for future reference
	genConfig := models.NPCGenerationConfig{
		WorldID:           config.WorldID,
		Seed:              config.Seed,
		PopulationSize:    config.PopulationSize,
		OrganizationCount: config.OrganizationCount,
		FamilyDensity:     config.FamilyDensity,
		GeneratedAt:       time.Now(),
	}

	return g.DB.Create(&genConfig).Error
}

func (g *NPCGenerator) createLocations(worldID uint) error {
	locations := []models.NPCLocation{
		{
			WorldID:      worldID,
			Name:         "Noble Quarter",
			Description:  "Where the wealthy and powerful reside",
			LocationType: "district",
			Population:   500,
			WealthLevel:  "wealthy",
		},
		{
			WorldID:      worldID,
			Name:         "Market District",
			Description:  "Bustling center of commerce",
			LocationType: "district",
			Population:   1200,
			WealthLevel:  "middle",
		},
		{
			WorldID:      worldID,
			Name:         "Common Quarter",
			Description:  "Where most citizens live and work",
			LocationType: "district",
			Population:   2000,
			WealthLevel:  "poor",
		},
		{
			WorldID:      worldID,
			Name:         "Outskirts",
			Description:  "Rural areas and farmland",
			LocationType: "rural",
			Population:   800,
			WealthLevel:  "poor",
		},
	}

	return g.DB.Create(&locations).Error
}

func (g *NPCGenerator) createOrganizations(worldID uint, count int) error {
	// Define organization templates
	orgTemplates := []struct {
		Name    string
		OrgType string
		Desc    string
		Power   int
		Ranks   []struct {
			Title     string
			Authority int
		}
	}{
		{
			Name:    "Royal Guard",
			OrgType: "military",
			Desc:    "Elite soldiers protecting the realm",
			Power:   9,
			Ranks: []struct {
				Title     string
				Authority int
			}{
				{"Captain", 10},
				{"Lieutenant", 7},
				{"Sergeant", 5},
				{"Guard", 3},
				{"Recruit", 1},
			},
		},
		{
			Name:    "Merchants Guild",
			OrgType: "guild",
			Desc:    "Powerful trading organization",
			Power:   7,
			Ranks: []struct {
				Title     string
				Authority int
			}{
				{"Guildmaster", 10},
				{"Senior Merchant", 7},
				{"Merchant", 5},
				{"Apprentice", 2},
			},
		},
		{
			Name:    "Thieves Guild",
			OrgType: "criminal",
			Desc:    "Underground criminal network",
			Power:   6,
			Ranks: []struct {
				Title     string
				Authority int
			}{
				{"Shadowmaster", 10},
				{"Lieutenant", 7},
				{"Cutpurse", 4},
				{"Pickpocket", 2},
			},
		},
		{
			Name:    "Temple of Light",
			OrgType: "religious",
			Desc:    "Primary religious institution",
			Power:   8,
			Ranks: []struct {
				Title     string
				Authority int
			}{
				{"High Priest", 10},
				{"Priest", 7},
				{"Acolyte", 4},
				{"Initiate", 1},
			},
		},
	}

	// Create organizations up to the requested count
	for i := 0; i < count && i < len(orgTemplates); i++ {
		template := orgTemplates[i]

		org := models.Organization{
			WorldID:     worldID,
			Name:        template.Name,
			OrgType:     template.OrgType,
			Description: template.Desc,
			PowerLevel:  template.Power,
			IsActive:    true,
		}

		if err := g.DB.Create(&org).Error; err != nil {
			return err
		}

		// Create ranks for this organization
		for j, rankTemplate := range template.Ranks {
			rank := models.OrganizationRank{
				OrganizationID: org.ID,
				Title:          rankTemplate.Title,
				AuthorityLevel: rankTemplate.Authority,
				SortOrder:      j + 1,
			}
			if err := g.DB.Create(&rank).Error; err != nil {
				return err
			}
		}
	}

	return nil
}

func (g *NPCGenerator) createNPCs(worldID uint, count int) error {
	// Get available locations
	var locations []models.NPCLocation
	if err := g.DB.Where("world_id = ?", worldID).Find(&locations).Error; err != nil {
		return err
	}

	// Name pools for generation
	firstNames := []string{"Alaric", "Brenna", "Cedric", "Diana", "Elara", "Finn", "Gwendolyn", "Harald", "Isla", "Joren", "Kira", "Leif", "Mira", "Nolan", "Olara", "Pike", "Quinn", "Renna", "Soren", "Tara"}
	lastNames := []string{"Ironforge", "Goldleaf", "Stormwind", "Brightblade", "Shadowmere", "Fireborn", "Frostwald", "Thornfield", "Riverstone", "Blackwood"}
	professions := []string{"Blacksmith", "Baker", "Guard", "Merchant", "Farmer", "Scribe", "Innkeeper", "Craftsman", "Laborer", "Artisan"}
	socialClasses := []string{"peasant", "commoner", "merchant", "minor_noble", "noble"}
	personalities := []string{"Kind and generous", "Stern but fair", "Ambitious", "Cautious", "Gregarious", "Suspicious", "Loyal", "Cunning", "Hot-tempered", "Wise"}

	for i := 0; i < count; i++ {
		// Pick random location
		location := locations[g.rand.Intn(len(locations))]

		npc := models.NPC{
			WorldID:     worldID,
			LocationID:  &location.ID,
			Name:        fmt.Sprintf("%s %s", firstNames[g.rand.Intn(len(firstNames))], lastNames[g.rand.Intn(len(lastNames))]),
			Age:         g.rand.Intn(60) + 18, // 18-78 years old
			Gender:      []string{"Male", "Female", "Non-binary"}[g.rand.Intn(3)],
			Profession:  professions[g.rand.Intn(len(professions))],
			SocialClass: socialClasses[g.rand.Intn(len(socialClasses))],
			Personality: personalities[g.rand.Intn(len(personalities))],
			IsAlive:     true,
		}

		if err := g.DB.Create(&npc).Error; err != nil {
			return err
		}
	}

	return nil
}

func (g *NPCGenerator) assignOrganizationMemberships(worldID uint) error {
	// Get all NPCs and organizations for this world
	var npcs []models.NPC
	var orgs []models.Organization

	if err := g.DB.Where("world_id = ?", worldID).Find(&npcs).Error; err != nil {
		return err
	}

	if err := g.DB.Where("world_id = ?", worldID).Preload("Ranks").Find(&orgs).Error; err != nil {
		return err
	}

	// Assign roughly 60% of NPCs to organizations
	membershipChance := 0.6

	for _, npc := range npcs {
		if g.rand.Float64() < membershipChance {
			// Pick random organization
			org := orgs[g.rand.Intn(len(orgs))]

			// Pick random rank (weighted toward lower ranks)
			if len(org.Ranks) > 0 {
				// 70% chance of lowest rank, 20% middle, 10% higher
				var selectedRank models.OrganizationRank
				roll := g.rand.Float64()
				if roll < 0.7 {
					// Lowest rank
					selectedRank = org.Ranks[len(org.Ranks)-1]
				} else if roll < 0.9 {
					// Middle rank
					selectedRank = org.Ranks[len(org.Ranks)/2]
				} else {
					// Higher rank
					selectedRank = org.Ranks[0]
				}

				membership := models.OrganizationMembership{
					NPCID:          npc.ID,
					OrganizationID: org.ID,
					RankID:         selectedRank.ID,
					Status:         "active",
					JoinedAt:       time.Now().AddDate(-g.rand.Intn(10), 0, 0), // Joined sometime in last 10 years
				}

				if err := g.DB.Create(&membership).Error; err != nil {
					return err
				}
			}
		}
	}

	return nil
}

func (g *NPCGenerator) createFamilyRelationships(worldID uint, density float64) error {
	// Get all NPCs
	var npcs []models.NPC
	if err := g.DB.Where("world_id = ?", worldID).Find(&npcs).Error; err != nil {
		return err
	}

	// Create family relationships based on density
	relationshipCount := int(float64(len(npcs)) * density * 0.5) // 0.5 because each relationship involves 2 people

	for i := 0; i < relationshipCount; i++ {
		// Pick two random NPCs
		npc1 := npcs[g.rand.Intn(len(npcs))]
		npc2 := npcs[g.rand.Intn(len(npcs))]

		// Don't create self-relationships
		if npc1.ID == npc2.ID {
			continue
		}

		// Check if relationship already exists
		var existing models.NPCRelationship
		result := g.DB.Where("(from_npc_id = ? AND to_npc_id = ?) OR (from_npc_id = ? AND to_npc_id = ?)",
			npc1.ID, npc2.ID, npc2.ID, npc1.ID).First(&existing)
		if result.Error == nil {
			continue // Relationship already exists
		}

		// Create family relationship
		relationshipTypes := []string{"sibling", "parent", "cousin", "spouse"}
		relType := relationshipTypes[g.rand.Intn(len(relationshipTypes))]

		relationship := models.NPCRelationship{
			WorldID:             worldID,
			FromNPCID:           npc1.ID,
			ToNPCID:             npc2.ID,
			RelationshipType:    "family",
			RelationshipSubtype: relType,
			Strength:            g.rand.Intn(7) + 4, // 4-10 strength for family
			IsPublic:            true,
		}

		if err := g.DB.Create(&relationship).Error; err != nil {
			return err
		}
	}

	return nil
}
